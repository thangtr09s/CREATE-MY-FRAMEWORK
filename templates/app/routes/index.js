// Example route file
// routes/index.js
const path = require('path');
const LoginController = require('../controllers/LoginController');
const bodyParser = require('my-web-framework/lib/bodyParser');
const authMiddleware = require('my-web-framework/lib/authMiddleware');
const mysqlPool = require('../config/mysql');

const loginController = new LoginController();

module.exports = (app) => {
    app.use(bodyParser.json());

    app.get('/login', (req, res) => loginController.showLoginPage(req, res));
    app.post('/login', (req, res) => loginController.login(req, res));
    app.get('/dashboard', (req, res) => loginController.getDashboard(req, res));
    app.get('/register', (req, res) => loginController.showRegister(req, res, {title: 'Register'}));
    app.post('/register', (req, res) => loginController.register(req, res));

    app.get('/', (req, res) => {
        res.render('index',{title: 'Home',message: 'Welcome to my website TaDuyXuan'}, (err, html) =>{
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                return res.end(`Server error: ${err.message}`);
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
        });
    });

    app.post('/logout', (req, res) => {
        //res.clearCookie('auth');
        res.redirect('/login');
    })
};
