'use strict';
/* Data Access Object (DAO) module for accessing users */

const sqlite = require('sqlite3');
const crypto = require('crypto');

// open the database
const db = new sqlite.Database('CMSmall.db', (err) => {
    if (err) throw err;
});

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE idUser = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
                const user = { id: row.idUser, username: row.mail, name: row.name, admin: row.admin }
                resolve(user);
            }
        });
    });
};

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE mail = ?';
        db.get(sql, [email], (err, row) => {
            if (err) { reject(err); }
            else if (row === undefined) { resolve(false); }
            else {
                const user = { id: row.idUser, username: row.mail, name: row.name, admin: row.admin };

                const salt = row.salt;
                crypto.scrypt(password, salt, 64, (err, hashedPassword) => {
                    if (err) reject(err);

                    const passwordHex = Buffer.from(row.hash, 'hex');

                    if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
                        resolve(false);
                    else resolve(user);
                });
            }
        });
    });
};

// get all users
exports.getUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT idUser, name, mail FROM users';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const users = rows.map((e) => ({ idUser: e.idUser, name: e.name, mail: e.mail }));
            resolve(users);
        });
    });
};