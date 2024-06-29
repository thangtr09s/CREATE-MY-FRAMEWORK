const UserModel = require('../models/UserModel');

class LoginController {
    constructor() {
        this.userModel = new UserModel();
    }

    showLoginPage(req, res) {
        res.render('User/login',{title: 'Login'}, (err, html) =>{
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                return res.end(`Server error: ${err.message}`);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
        });
    }

    login(req, res) {
        const { username, password } = req.body;
        this.userModel.validateUser(username, password, (error, user) => {
            if (error) {
                return res.render('User/login', { error: 'Database error' });
            }
            if (user) {
                res.redirect('/dashboard');
            } else {
                res.render('User/login', { error: 'Invalid username or password' });
            }
        });
    }

    showRegister(req, res, valid){
        res.render('User/register',valid, (err, html) =>{
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                return res.end(`Server error: ${err.message}`);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
        });
    }

    register(req, res){
        const {username, email, password} = req.body;
        this.userModel.register(username, password, (error, isRegistered) => {
            if (error) {
                console.log('create User error 111');
                return res.render('User/register', { title: 'Database error' }, (err, html) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        return res.end(`Server error: ${err.message}`);
                    }
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(html);
                });
            }
            if (isRegistered) {
                console.log('create User error 112');
                res.redirect('/dashboard');
            } else {
                console.log('create User error 113');
                return res.render('User/register', { title: 'Username already exists' }, (err, html) => {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        return res.end(`Server error: ${err.message}`);
                    }
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(html);
                });
            }
        });
    }

    getDashboard(req, res) {
        res.render('dashboard',{title: 'Dashboard',message: 'Welcome to my website TaDuyXuan'}, (err, html) =>{
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                return res.end(`Server error: ${err.message}`);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
        });
    }
}

module.exports = LoginController;
