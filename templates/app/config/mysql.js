const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'yourUsername',
    password: 'yourPassword',
    database: 'yourDatabase'
});

module.exports = pool;
