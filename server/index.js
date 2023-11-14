'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the user info in the DB
const cors = require('cors');

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});


// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));


app.use(express.static('public'));

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'Not authenticated' });
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: '347ab583b0852e3986fe477cb561ab687ffebdd7b358c9eb639b156344dde55d',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());







/*** APIs ***/

// GET /api/title
app.get('/api/title', (req, res) => {
  dao.getTitle()
    .then(title => res.json(title))
    .catch((err) => { res.status(500).json({ errors: ["Database error"] }); });
});

// GET /api/pages
app.get('/api/pages', isLoggedIn, (req, res) => {
  dao.listPages()
    .then(pages => res.json(pages))
    .catch((err) => { res.status(500).json({ errors: ["Database error"] }); });
});

// GET /api/pages/published
app.get('/api/pages/published', (req, res) => {
  dao.listPagesPublished()
    .then(pages => res.json(pages))
    .catch((err) => { res.status(500).json({ errors: ["Database error"] }); });
});

// GET /api/pages/<id>
app.get('/api/pages/:id', (req, res) => {
  dao.getPage(req.params.id, req.user)
    .then(pages => {
      if (pages.error)
        res.status(404).json(pages);
      else
        res.json(pages)
    })
    .catch((err) => { res.status(500).json(err); });
});

// POST /api/pages
app.post('/api/pages', isLoggedIn, [
  check('title').isLength({ min: 1 }),
  check('creationDate').isDate({ format: 'YYYY-MM-DD', strictMode: true }),
  check('publicationDate').optional({ values: 'falsy' }).isDate({ format: 'YYYY-MM-DD', strictMode: true }),
  check('blocks.*.position').isInt(),
  check('blocks.*.content').isLength({ min: 1 }),
  check('blocks.*.type').isLength({ min: 1 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const page = {
    title: req.body.title,
    idUser: req.user.id,
    creationDate: req.body.creationDate,
    publicationDate: req.body.publicationDate,
  };
  if (req.user.admin) {
    page.idUser = req.body.idUser;
  }
  dao.createPage(page).then((pageId) => {
    const blocks = req.body.blocks.map((e) => {
      e.idPage = pageId;
      return e;
    });
    dao.addBlocks(blocks)
      .then(() => res.status(201).json(pageId))
      .catch((err) => {
        res.status(503).json({ error: `Database error during the creation of page.` });
      })
  })
    .catch((err) => {
      res.status(503).json({ error: `Database error during the creation of page.` });
    })
});

// DELETE /api/pages/<id>
app.delete('/api/pages/:id', isLoggedIn, (req, res) => {
  dao.deletePage(req.params.id, req.user.id, req.user.admin) // It is WRONG to use something different from req.user.id
    .then(() => {
      dao.deleteBlocks(req.params.id)
        .then(() => res.end())
        .catch((err) => { res.status(500).json({ error: `Database error during the delete` }); });
    })
    .catch((err) => {
      res.status(500).json({ error: `Database error during the delete` });
    })
});

// PUT /api/title
app.put('/api/title', isLoggedIn, [
  check('title').isLength({ min: 1 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const title = {
    title: req.body.title,
  };
  if (req.user.admin) {
    dao.updateTitle(title)
      .then(() => res.end())
      .catch((err) => {
        res.status(503).json({ error: `Database error during the update of title.` });
      })
  }
  else
    res.status(401).json({ error: `change denied` });
});

// GET /api/users
app.get('/api/users', isLoggedIn, (req, res) => {
  if (req.user.admin) {
    userDao.getUsers()
      .then(users => res.json(users))
      .catch((err) => { res.status(500).json({ errors: ["Database error"] }); });
  }
  else {
    res.status(401).json({ errors: ["Access denied"] });
  }
});





/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => { res.end(); });
});




/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`react-qa-server listening at http://localhost:${port}`);
});