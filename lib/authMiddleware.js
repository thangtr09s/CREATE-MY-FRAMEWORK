//lib/authMiddleware.js
//dùng để xử lý xác thực (nguoi dung) và phát sinh token 
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;
class AuthMiddleware {
    constructor() {
        //
    }

    static authenticate(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log(`token la ${token}`);

        if (!token) {
            res.statusCode = 401;
            return res.end('Access denied. No token provided.');
        }

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                res.statusCode = 403;
                return res.end('Invalid token.');
            }

            req.user = user;
            next();
        });
    }

    static generateToken(user) {
        return jwt.sign(user, secretKey, { expiresIn: '1h' });
    }

}

module.exports = AuthMiddleware;
