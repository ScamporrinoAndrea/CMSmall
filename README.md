[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/suhcjUE-)
# Exam #1: "CMSmall"
## Student: s318927 SCAMPORRINO ANDREA

## React Client Application Routes

- Route `/`: Schermata principale, mostra tutte le pagine con la possibilità di filtrarle quando l'utente ha effettuato il login, e solo quelle pubblicate quando non ha eseguito l'accesso.
- Route `/page/:id`: Mostra il contentuto della pagina.
- Route `/add`: Form per la creazione di una pagina.
- Route `/edit/:id`: Form per la modifica di una pagina selezionata tramite l'ID.
- Route `/login`: Mostra la schermata per effettuare il login.
- Route `/*`: Route per le pagine che non esistono.

## API Server

### __Autenticazione__

#### __Crea una nuova sessione (login)__

URL: `/api/sessions`

Metodo HTTP: POST

Descrizione: Crea una nuova sessione partendo dalle credenziali date.

Request body:
```
{
  "username": "user@polito.it",
  "password": "pwd"
}
```

Response: `200 OK` (success), `401 Unauthorized` (error).

Response body:
```
{
  "id":1,
  "username":"user@polito.it",
  "name":"user",
  "admin":0
}
```


#### __Ritorna la sessione corrente se presente__

URL: `/api/sessions/current`

Metodo HTTP: GET

Descrizione: Verifica se la sessione è valida e ritorna le informazioni dell'utente. Deve essere fornito un cookie con un ID di sessione valido per ottenere le informazioni dell'utente autenticato nella sessione corrente.

Request body: _None_ 

Response: `201 Created` (success), `401 Unauthorized` (error).

Response body:
```
{
  "id":1,
  "username":"user@polito.it",
  "name":"user",
  "admin":0
}
```

#### __Elimina la sessione corrente (logout)__

URL: `/api/sessions/current`

Metodo HTTP: DELETE

Descrizione: Elimina la sessione corrente. Deve essere fornito un cookie con un ID di sessione valido.

Request body: _None_

Response: `200 OK` (success), `500 Internal Server Error` (generic error).

Response body: _None_

### __Generali__

#### __Ritorna il titolo del sito__

URL: `/api/title`

Metodo HTTP: GET

Descrizione: Ritorna il titolo del sito.

Request body: _None_

Response: `200 OK` (success), `500 Internal Server Error` (Database error).

Response body:
```
"CMSmall"
```

#### __Ritorna tutte le pagine__

URL: `/api/pages`

Metodo HTTP: GET

Descrizione: Ritorna tutte le pagine per la visualizzazione nella home dell'utente che ha effettuato l'accesso. Ogni pagina è composta dalle sue proprietà e da un array di blocchi in cui sono salvati solo il primo header, il primo paragrafo e la prima immagine (se esistenti). Deve essere fornito un cookie con un ID di sessione valido.

Request body: _None_

Response: `200 OK` (success), `500 Internal Server Error` (Database error). Se la richiesta non proviene da una sessione autenticata, `401 Unauthorized`.

Response body:
```
[
  {
    "id": 67,
    "title": "La mia prima pagina",
    "idUser": 1,
    "name": "user",
    "creationDate": "2023-06-09T22:00:00.000Z",
    "publicationDate": "2023-06-20T22:00:00.000Z",
    "blocks": [
      {
        "type": "Header",
        "content": "Questo è un header",
        "position": 0
      },
      {
        "type": "Image",
        "content": "http://localhost:3001/image1.jpg",
        "position": 2
      },
      {
        "type": "Paragraph",
        "content": "Questo è un paragrafo",
        "position": 1
      }
    ]
  },
  ...
]
```

#### __Ritorna tutte le pagine pubblicate__

URL: `/api/pages/published`

Metodo HTTP: GET

Descrizione: Ritorna tutte le pagine già pubblicate per la visualizzazione nella home dell'utente che non ha effettuato l'accesso. Ogni pagina è composta dalle sue proprietà e da un array di blocchi in cui sono salvati solo il primo header, il primo paragrafo e la prima immagine (se esistenti).

Request body: _None_

Response: `200 OK` (success), `500 Internal Server Error` (Database error).

Response body:
```
[
  {
    "id": 67,
    "title": "La mia prima pagina",
    "idUser": 1,
    "name": "user",
    "creationDate": "2023-06-09T22:00:00.000Z",
    "publicationDate": "2023-06-20T22:00:00.000Z",
    "blocks": [
      {
        "type": "Header",
        "content": "Questo è un header",
        "position": 0
      },
      {
        "type": "Image",
        "content": "http://localhost:3001/image1.jpg",
        "position": 2
      },
      {
        "type": "Paragraph",
        "content": "Questo è un paragrafo",
        "position": 1
      }
    ]
  },
  ...
]
```

#### __Ritorna la pagina richiesta (ID)__

URL: `/api/pages/<id>`

Metodo HTTP: GET

Descrizione: Ritorna la pagina richiesta dall'ID. In caso questa non esistesse oppure l'utente non avesse l'autorizzazione a vederla viene ritornato un messaggio di errore.

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (wrong ID or no permission), `500 Internal Server Error` (Database error).

Response body:
```
{
    "id": 75,
    "title": "Il blog di Andrea",
    "idUser": 3,
    "name": "Andrea",
    "creationDate": "2023-06-10T22:00:00.000Z",
    "publicationDate": "2023-06-16T22:00:00.000Z",
    "blocks": [
        {
            "type": "Paragraph",
            "content": "paragraph 1",
            "position": 0
        },
        {
            "type": "Image",
            "content": "http://localhost:3001/image3.jpg",
            "position": 1
        },
        {
            "type": "Header",
            "content": "header 1",
            "position": 5
        },
        {
            "type": "Header",
            "content": "header 2",
            "position": 6
        },
        {
            "type": "Paragraph",
            "content": "paragraph 2",
            "position": 7
        },
        ...
    ]
}
```

#### __Aggiunge una pagina__

URL: `/api/pages`

Metodo HTTP: POST

Descrizione: Crea una pagina. Deve essere fornito un cookie con un ID di sessione valido.

Request body:
```
{
  "title":"titolo pagina",
  "publicationDate":null,
  "blocks":
  [
    {"type":"Header","content":"header pagina ","position":0},
    {"type":"Paragraph","content":"paragrafo pagina","position":1}
  ],
  "creationDate":"2023-06-24"
}
```

Response: `201 Created` (success), `503 Service Unavailable` (Database error). Se il body della richiesta non è corretto, `422 Unprocessable Entity` (validation error). Se la richiesta non proviene da una sessione autenticata, `401 Unauthorized`.

Response body: L'ID della pagina creata
```
81
```

#### __Elimina una pagina__

URL: `/api/pages/<id>`

Metodo HTTP: DELETE

Descrizione: Elimina una pagina identificata dal suo ID. Deve essere fornito un cookie con un ID di sessione valido e l'utente deve essere o un admin o il proprietario della pagina.

Request body: _None_

Response: `200 OK` (success), `500 Internal Server Error` (Database error). Se la richiesta non proviene da una sessione autenticata, `401 Unauthorized`.

Response body: _None_

#### __Modifica il titolo del sito__

URL: `/api/title`

Metodo HTTP: PUT

Descrizione: Modifica il titolo del sito. Deve essere fornito un cookie con un ID di sessione valido e l'utente deve essere un admin.

Request body:
```
{"title":"CMSmall"}
```

Response: `200 OK` (success), `503 Service Unavailable` (Database error). Se il body non è corretto, `422 Unprocessable Entity` (validation error). Se la richiesta non proviene da una sessione autenticata come admin, `401 Unauthorized`.

Response body: _None_

#### __Ritorna tutti gli utenti__

URL: `/api/users`

Metodo HTTP: GET

Descrizione: Ritorna tutti gli utenti. Deve essere fornito un cookie con un ID di sessione valido e l'utente deve essere un admin.

Request body: _None_

Response: `200 OK` (success), `500 Internal Server Error` (Database error). Se la richiesta non proviene da una sessione autenticata, `401 Unauthorized`.

Response body:
```
[
    {
        "idUser": 1,
        "name": "user",
        "mail": "user@polito.it"
    },
    {
        "idUser": 2,
        "name": "admin",
        "mail": "admin@polito.it"
    },
    {
        "idUser": 3,
        "name": "Andrea",
        "mail": "318927@polito.it"
    }
]
```

## Database Tables

- Table `users` - (idUser, name, mail, salt, hash, admin) -> admin=1 se l'utente è un admin 0 altrimenti
- Table `pages` - (idPage, title, idUser, creationDate, publicationDate)
- Table `blocks` - (idBlock, idPage, type, content, position)
- Table `properties` - (idProp, title)

## Main React Components

- `Home`: Componente principale per la grafica della home, gestisce il filtro delle pagine se l'utente è autenticato e chiama il componente PageCard per ogni pagina.
- `PageCard`: Si occupa della visualizzazione della singola pagina nell'elenco delle pagine della home.
- `Page`: Mostra la pagina a schermo intero. È utilizzato dai componenti PageCard e Form.
- `MyForm` (in `Form.jsx`): Form per la creazione e la modifica di una pagina.
- `Login`: Pagina per effettuare il login.


## Screenshot

- Tutte le pagine (Home)
![Screenshot](./img/AllPages.png)

- Form per la creazione di una pagina
![Screenshot](./img/Form.png)

## Users Credentials

- `mail`: admin@polito.it, `password`: pwd (utente admin)
- `mail`: 318927@polito.it, `password`: pwd
- `mail`: 318928@polito.it, `password`: pwd
- `mail`: 318929@polito.it, `password`: pwd


