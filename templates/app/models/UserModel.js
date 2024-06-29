const mysql = require('mysql');
const mysqlPool = require('../config/mysql');
class UserModel {
    constructor() {
        this.mysqlPool = mysqlPool;
    }

    findUser(username, callback) {
        const query = 'SELECT * FROM users WHERE username = ?';
        this.mysqlPool.query(query, [username], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            if (results.length > 0) {
                return callback(null, results[0]);
            } else {
                return callback(null, null);
            }
        });
    }

    validateUser(username, password, callback) {
        this.findUser(username, (error, user) => {
            if (error) {
                return callback(error, null);
            }
            if (user && user.password === password) { // hash md5
                return callback(null, true);
            } else {
                return callback(null, false);
            }
        });
    }

    register(username, password, callback) {
        this.findUser(username, (error, user) =>{
            if(error){
                console.log('find User error');
                return callback(error, null);
            }
            if(user){
                console.log('find User false');
                return callback(null, false);
            }else{
                console.log('find User true');
                this.create_user(username, password, (error, results) => {
                    console.log('create User');
                    if(error){
                        console.log('create User false');
                        return callback(error, null);
                    }
                    console.log('create User true');
                    return callback(null, true);
                });
            }
        });
    }

    create_user(username, password, callback) {
        this.mysqlPool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (error, results) => {
            if (error) {
                console.log('create User 1', error);
                return callback(error);
            }
            console.log('create User 2');
            callback(null, results);
        });
    }
}
module.exports = UserModel;