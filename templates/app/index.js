const Framework = require('my-web-framework/lib/framework');
const ValidationMiddleware = require('my-web-framework/lib/validationMiddleware');
const AuthMiddleware = require('my-web-framework/lib/authMiddleware');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const renderMiddleware = require('my-web-framework/lib/renderMiddleware');
const mysqlPool = require('./config/mysql');
const bodyParser = require('my-web-framework/lib/bodyParser');

const app = new Framework(__dirname);
console.log(`duong dan goc dirname ${__dirname}`);
console.log(`duong dan goc ${app}`);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(Framework.static(path.join(__dirname, 'public')));
app.use(renderMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

require('./routes')(app);
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
