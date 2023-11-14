'use strict';
/* Data Access Object (DAO) module */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('CMSmall.db', (err) => {
    if (err) throw err;
});

// get title
exports.getTitle = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT title FROM properties';
        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.title);
        });
    });
};

// get all pages
exports.listPages = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT pages.idPage as idPage, title, pages.idUser as idUser, name, creationDate, publicationDate, json_group_array(json_object('type', type, 'content', content,'position',position)) AS blocks FROM pages, blocks, users WHERE pages.idPage = blocks.idPage AND pages.idUser = users.idUser AND (blocks.idPage,position) IN (SELECT idPage, MIN(position) FROM blocks GROUP BY idPage,type) GROUP BY pages.idPage";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const pages = rows.map((e) => ({ id: e.idPage, title: e.title, idUser: e.idUser, name: e.name, creationDate: dayjs(e.creationDate), publicationDate: dayjs(e.publicationDate), blocks: JSON.parse(e.blocks) }));
            resolve(pages);
        });
    });
};

// get published pages
exports.listPagesPublished = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT pages.idPage as idPage, title, pages.idUser as idUser, name, creationDate, publicationDate, json_group_array(json_object('type', type, 'content', content,'position',position)) AS blocks FROM pages, blocks, users WHERE pages.idPage = blocks.idPage AND pages.idUser = users.idUser AND publicationdate<=? AND (blocks.idPage,position) IN (SELECT idPage, MIN(position) FROM blocks GROUP BY idPage,type) GROUP BY pages.idPage";
        db.all(sql, [dayjs().format('YYYY-MM-DD')], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const pages = rows.map((e) => ({ id: e.idPage, title: e.title, idUser: e.idUser, name: e.name, creationDate: dayjs(e.creationDate), publicationDate: dayjs(e.publicationDate), blocks: JSON.parse(e.blocks) }));
            resolve(pages);
        });
    });
};

// add a new page
exports.createPage = (page) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO pages(title,idUser,creationDate,publicationDate) VALUES(?, ?, ?, ?)';
        db.run(sql, [page.title, page.idUser, page.creationDate, page.publicationDate], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.lastID);
        });
    });
};

// add blocks of a page
exports.addBlocks = (blocks) => {
    return new Promise((resolve, reject) => {
        blocks.forEach(element => {
            const sql = 'INSERT INTO blocks(idPage, type, content, position) VALUES(?, ?, ?, ?)';
            db.run(sql, [element.idPage, element.type, element.content, element.position], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });
};

// get the page identified by {id}
exports.getPage = (id, user) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT pages.idPage as idPage, title, pages.idUser as idUser, name, creationDate, publicationDate, json_group_array(json_object('type', type, 'content', content,'position',position)) AS blocks FROM pages, blocks, users WHERE pages.idPage=blocks.idPage AND pages.idUser=users.idUser AND pages.idPage=? GROUP BY pages.idPage";
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row == undefined || row.length === 0) {
                resolve({ error: 'Page not found.' });
            } else {
                if (user || dayjs(row.publicationDate).diff(dayjs(), 'day') <= 0) {
                    const page = { id: row.idPage, title: row.title, idUser: row.idUser, name: row.name, creationDate: dayjs(row.creationDate), publicationDate: dayjs(row.publicationDate), blocks: JSON.parse(row.blocks) };
                    resolve(page);
                }
                else {
                    resolve({ error: "You don't have permission to view the page" });
                }
            }
        });
    });
};

// delete an existing page
exports.deletePage = (id, userId, admin) => {
    if (admin) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM pages WHERE idPage = ?';
            db.run(sql, [id], function (err) {
                if (err) {
                    reject(err);
                    return;
                } else if (this.changes == 0) {
                    reject({ error: 'Database error' });
                }
                else {
                    resolve(null);
                }
            });
        });
    }
    else {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM pages WHERE idPage = ? AND idUser = ?';
            db.run(sql, [id, userId], function (err) {
                if (err) {
                    reject(err);
                    return;
                } else if (this.changes == 0) {
                    reject({ error: 'Database error' });
                }
                else {
                    resolve(null);
                }
            });
        });
    }
}

// delete blocks of an existing page
exports.deleteBlocks = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM blocks WHERE idPage = ?';
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
                return;
            } else {
                resolve(null);
            }
        });
    });
}

// update a title
exports.updateTitle = (title) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE properties SET title=? WHERE idProp = 1';
        db.run(sql, [title.title], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(null);
        });
    });
};