// renderMiddleware.js
// có nhiệm vụ render các file view sử dụng EJS template
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const renderMiddleware = (req, res, next) => {
    res.render = (filePath, data, callback) => {
        const fullPath = path.join(req.app.projectRoot,'views',`${filePath}.ejs`);
        console.log(`Rendering view from: ${fullPath}`);
        console.log('hi everyone');
        fs.readFile(fullPath, 'utf-8', (err, content) => {
            if (err) {
                return callback(new Error(`No Find view ${filePath}: ${err}`));
            }
            const rendered = ejs.render(content, data);
            callback(null, rendered);
        });
    };
    next();
};

module.exports = renderMiddleware;
