// lib/bodyParser.js
//dùng để xử lý dữ liệu đầu vào từ các request HTTP. 
//Cụ thể, nó cung cấp hai middleware để xử lý các request có dạng application/json và 
//application/x-www-form-urlencoded.
module.exports = {
    json: function () {
        return (req, res, next) => {
            if (req.headers['content-type'] === 'application/json') {
                let data = '';
                req.on('data', chunk => {
                    data += chunk;
                });
                req.on('end', () => {
                    try {
                        req.body = JSON.parse(data);
                        next();
                    } catch (e) {
                        res.status(400).send('Invalid JSON');
                    }
                });
            } else {
                next();
            }
        };
    },
    urlencoded: function () {
        return (req, res, next) => {
            if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                let data = '';
                req.on('data', chunk => {
                    data += chunk;
                });
                req.on('end', () => {
                    req.body = {};
                    const pairs = data.split('&');
                    pairs.forEach(pair => {
                        const [key, value] = pair.split('=');
                        req.body[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, ' '));
                    });
                    next();
                });
            } else {
                next();
            }
        };
    }
};
