import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Home from './views/Home'
import MyForm from './views/Form'
import Login from './views/Login'
import Page from './components/Page';
import API from './API'

function DefaultRoute() {
  return (
    <Container className='App'>
      <h1>No data here...</h1>
      <h2>This is not the route you are looking for!</h2>
      <Link to='/'>Please go back to main page</Link>
    </Container>
  );
}

function App() {
  const [title, setTitle] = useState('');
  const [pages, setPages] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [filter, setFilter] = useState('published');

  useEffect(() => {
    API.getUserInfo()
      .then((user) => {
        setLoggedIn(true);
        setUser(user);
        setDirty(true);
      }).catch((err) => {
        setDirty(true);
      })
  }, []);

  useEffect(() => {
    API.getTitle()
      .then((t) => {
        setTitle(t);
      })
      .catch((err) => handleError(err));
  }, []);

  useEffect(() => {
    if (dirty) {
      if (loggedIn) {
        API.getPages()
          .then((p) => {
            setPages(p);
            setDirty(false);
            setInitialLoading(false);
          })
          .catch((err) => handleError(err));
      }
      else {
        API.getPagesPublished()
          .then((p) => {
            setPages(p);
            setDirty(false);
            setInitialLoading(false);
          })
          .catch((err) => handleError(err));
      }
    }
  }, [dirty]);

  function updateTitle(newTitle) {
    API.updateTitle(newTitle)
      .then(() => setTitle(newTitle))
      .catch((err) => handleError(err));
  }

  function handleError(err) {
    let errMsg = 'Unkwnown error';
    if (err.errors) {
      if (err.errors[0])
        if (err.errors[0].msg)
          errMsg = err.errors[0].msg;
    } else if (err.error) {
      errMsg = err.error;
    }
    setErrorMsg(errMsg);
  }

  function addPage(e) {
    setInitialLoading(true);
    API.addPage(e)
      .then(() => setDirty(true))
      .catch((err) => handleError(err));
  }

  function editPage(e) {
    setInitialLoading(true);
    API.addPage(e)
      .then(() => {
        API.deletePage(e.id)
          .then(() => setDirty(true))
          .catch((err) => handleError(err));
      })
      .catch((err) => handleError(err));
  }

  function deletePage(id) {
    setInitialLoading(true);
    API.deletePage(id)
      .then(() => setDirty(true))
      .catch((err) => handleError(err));
  }

  function changeFilter(newFilter) {
    setFilter(newFilter);
  }

  function loginSuccessful(user) {
    setUser(user);
    setLoggedIn(true);
    setDirty(true);
  }

  function doLogOut() {
    API.logOut()
      .then(() => {
        setLoggedIn(false);
        setUser(undefined);
        setDirty(true);
        setFilter('published');
      })
      .catch((err) => handleError(err));
  }



  return (
    <BrowserRouter>
      <Routes style={{ overflowX: 'hidden' }}>
        <Route path='/' element={
          <Home
            pages={pages}
            errorMsg={errorMsg}
            resetErrorMsg={() => setErrorMsg('')}
            user={user}
            logout={doLogOut}
            initialLoading={initialLoading}
            filter={filter}
            changeFilter={changeFilter}
            deletePage={deletePage}
            title={title}
            updateTitle={updateTitle} />} />
        <Route path='/page/:id' element={<Page />} />
        <Route path='/add' element={!loggedIn ? <Navigate replace to='/' /> :
          <MyForm addPage={addPage} user={user} logout={doLogOut} updateTitle={updateTitle} changeFilter={changeFilter} title={title} />} />
        <Route path='/edit/:id' element={!loggedIn ? <Navigate replace to='/' /> :
          <MyForm addPage={addPage} user={user} logout={doLogOut} updateTitle={updateTitle} changeFilter={changeFilter} title={title} editPage={editPage} pages={pages} />} />
        <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <Login loginSuccessful={loginSuccessful} title={title} />} />
        <Route path='/*' element={<DefaultRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
