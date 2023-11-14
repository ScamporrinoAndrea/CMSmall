/**
 * All the API calls
 */

const URL = 'http://localhost:3001/api';

function getTitle() {
    // call  /api/title
    return new Promise((resolve, reject) => {
        fetch(URL + '/title')
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((title) => resolve(title))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    // analyze the cause of error
                    response.json()
                        .then((message) => { reject(message); }) // error message in the response body
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function getPages() {
    // call  /api/pages
    return new Promise((resolve, reject) => {
        fetch(URL + '/pages', {
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((pages) => resolve(pages))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    // analyze the cause of error
                    response.json()
                        .then((message) => { reject(message); }) // error message in the response body
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function getUsers() {
    // call  /api/users
    return new Promise((resolve, reject) => {
        fetch(URL + '/users', {
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((users) => resolve(users))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    // analyze the cause of error
                    response.json()
                        .then((message) => { reject(message); }) // error message in the response body
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function getPagesPublished() {
    // call  /api/pages/published
    return new Promise((resolve, reject) => {
        fetch(URL + '/pages/published')
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((pages) => resolve(pages))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    // analyze the cause of error
                    response.json()
                        .then((message) => { reject(message); }) // error message in the response body
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function getPage(id) {
    // call  /api/pages/<id>
    return new Promise((resolve, reject) => {
        fetch(URL + `/pages/${id}`, {
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((page) => resolve(page))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    // analyze the cause of error
                    response.json()
                        .then((message) => { reject(message); }) // error message in the response body
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function addPage(page) {
    // call  POST /api/pages
    return new Promise((resolve, reject) => {
        fetch(URL + `/pages`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(page),
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((id) => resolve(id))
                    .catch(() => { reject({ error: "Cannot parse server response." }) });
            } else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) });
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function deletePage(id) {
    // call  DELETE /api/pages/<id>
    return new Promise((resolve, reject) => {
        fetch(URL + `/pages/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) });
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function updateTitle(title) {
    // call  PUT /api/title
    return new Promise((resolve, reject) => {
        fetch(URL + '/title', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: title }),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) });
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function logIn(credentials) {
    // call  POST /api/sessions
    return new Promise((resolve, reject) => {
        fetch(URL + '/sessions', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((user) => resolve(user))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    // analyze the cause of error
                    response.json()
                        .then((message) => { reject(message); }) // error message in the response body
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function logOut() {
    // call  DELETE /api/sessions/current
    return new Promise((resolve, reject) => {
        fetch(URL + '/sessions/current', {
            method: 'DELETE',
            credentials: 'include'
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) });
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function getUserInfo() {
    // call  /api/sessions/current
    return new Promise((resolve, reject) => {
        fetch(URL + '/sessions/current', {
            credentials: 'include'
        })
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((userInfo) => resolve(userInfo))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    // analyze the cause of error
                    response.json()
                        .then((message) => { reject(message); }) // error message in the response body
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}



const API = {
    getTitle, getPages, getPagesPublished, getPage, addPage, deletePage, updateTitle,
    logIn, logOut, getUserInfo, getUsers
};
export default API;