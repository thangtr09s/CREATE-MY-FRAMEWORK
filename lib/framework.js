const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const Router = require('./router');
const bodyParser = require('./bodyParser');
const authMiddleware = require('./authMiddleware');
const Middleware = require('./middleware');
const ejs = require('ejs');

class Framework {
//    Constructor (constructor(projectRoot)):

//Khởi tạo các thành phần chính của framework như Router, http.Server, và Middleware.
//Cấu hình các thư mục mặc định cho views và view engine là EJS.
//Đăng ký middleware bodyParser để xử lý phân tích các loại dữ liệu gửi đến (json và urlencoded).
    constructor(projectRoot) {
        this.router = new Router();
        this.server = http.createServer(this.handleRequest.bind(this));
        this.middleware = new Middleware();

        this.middlewares = [];
        this.projectRoot = projectRoot;

        this.settings = {};// For storing configuration settings

        // Default views and view engine
        this.settings.views = path.join(this.projectRoot, 'views');
        this.settings['view engine'] = 'ejs';

        //body parse
        this.middleware.use(bodyParser);
    }
//Phương thức set(key, value):

//Cho phép thiết lập các cài đặt (settings) cho framework, ví dụ như views và view engine
    set(key, value) {
        this.settings[key] = value;
    }
//Phương thức use(middleware):

//Đăng ký một middleware vào framework, cả trong middleware và middlewares (mảng các middleware đã đăng ký).
    use(middleware) {
        this.middleware.use(middleware);
        this.middlewares.push(middleware);
    }
//Phương thức get(path, handler) và post(path, handler):

//Đăng ký các route sử dụng HTTP method GET và POST với router.
    get(path, handler) {
        this.router.get(path, handler);
    }

    post(path, handler) {
        this.router.post(path, handler);
    }

//Static method static(staticPath):

//Middleware để phục vụ các tài nguyên tĩnh như file CSS, JS, hình ảnh, v.v.
//Xử lý yêu cầu GET cho các tài nguyên tĩnh dựa trên đường dẫn.
    static static(staticPath) {
        return async (req, res, next) => {
            //const parsedUrl = url.parse(req.url);
            const parsedUrl = new URL(req.url, `https://${req.headers.host}`);
            console.log(`parsedUrl la : ${parsedUrl}`);
            let pathname = `${staticPath}${parsedUrl.pathname}`;
            console.log(`pathname la : ${pathname}`);
            const ext = path.parse(pathname).ext;
            console.log(`ext la : ${ext}`);

            const map = {
                '.ico': 'image/x-icon',
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.json': 'application/json',
                '.css': 'text/css',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.wav': 'audio/wav',
                '.mp3': 'audio/mpeg',
                '.svg': 'image/svg+xml',
                '.pdf': 'application/pdf',
                '.doc': 'application/msword'
            };
            // Log pathname for debugging
            console.log(`Requested Pathname: ${pathname}`);

            fs.exists(pathname, function (exist) {
                if (!exist) {
                    console.log("Dau tien qua day");
                    return next();
                }

                if (fs.statSync(pathname).isDirectory()) {
                    console.log("Index fake");

                    const indexFilePath = path.join(pathname, 'index.html');
                    if (fs.existsSync(indexFilePath)) {
                        pathname = indexFilePath;
                    } else {
                        return next();
                    }
                    console.log(`Updated Pathname: ${pathname}`);
                }

                fs.readFile(pathname, function (err, data) {
                    if (err) {
                        if (!res.headersSent) {
                            console.log("Qua day lan 2");
                            res.statusCode = 500;
                            res.end(`Error getting the file: ${err}.`);
                        }
                    } else {
                        if (!res.headersSent) {
                            console.log("Qua day lan 3");
                            res.setHeader('Content-type', map[ext] || 'text/plain');
                            res.end(data);
                        }
                    }
                });
            });
        };
    }
//Phương thức addRenderToRes(res), addSendFileToRes(res), addRedirectToRes(res):

//Mở rộng đối tượng res của HTTP response để hỗ trợ các chức năng render template, gửi file, và redirect.
    addRenderToRes(res) {
        res.render = (view, data) => {
            const filePath = path.join(this.projectRoot, 'views', `${view}.ejs`);
            ejs.renderFile(filePath, data, {}, (err, str) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Server Error');
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(str);
            });
        };
    }

    addSendFileToRes(res) {
        res.sendFile = (filePath) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    if (!res.headersSent) {
                        res.statusCode = 500;
                        res.end(`Error getting the file: ${err}.`);
                    }
                } else {
                    if (!res.headersSent) {
                        res.end(data);
                    }
                }
            });
        };
    }

    addRedirectToRes(res) {
        res.redirect = (location) => {
            res.writeHead(302, { Location: location });
            res.end();
        };
    }
//Phương thức handleRequest(req, res):

//Xử lý yêu cầu từ client.
//Đặt req.app để gắn instance của framework vào request object.
//Thực thi các middleware đã đăng ký và sau đó chuyển tiếp yêu cầu tới router để xử lý định tuyến.
    async handleRequest(req, res) {
        req.app = this; // Add this line to set the app instance in the request object
        this.addRenderToRes(res);
        this.addSendFileToRes(res);
        this.addRedirectToRes(res);

        let idx = 0;
        const next = async () => {
            if (idx >= this.middlewares.length) {
                return this.router.handle(req, res);
            }
            const middleware = this.middlewares[idx++];
            if (typeof middleware === 'function') {
                await middleware(req, res, next);
            } else {
                await next(); // Call next middleware if it's not a function
            }
        };

        await next();
    }
 //   Phương thức listen(port, callback):

 //   Khởi động server và lắng nghe các kết nối từ client tại cổng đã chỉ định.

    listen(port, callback) {
        this.server.listen(port, callback);
    }
}

//Phương thức render(res, view, data):

//Render một file view sử dụng EJS với dữ liệu được cung cấp và gửi kết quả về client.
Framework.prototype.render = function(res, view, data) {
    const filePath = path.join(this.projectRoot, 'views', `${view}.ejs`);
    fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end(`Error loading view ${view}: ${err}`);
            return;
        }
        const rendered = ejs.render(content, data);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(rendered);
    });
};

module.exports = Framework;
