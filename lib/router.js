// triển khai một Router đơn giản. Router này hỗ trợ đăng ký các route với các phương thức HTTP khác nhau 
//(GET, POST) và hỗ trợ middleware để xử lý trước khi đi vào xử lý route chính.
const url = require('url');

class Router {
    constructor() {
        this.routes = [];
        this.middlewares = []; //validate
    }

    use(middleware) {
        this.middlewares.push(middleware);
    } //validate

    register(method, path, handler) {
        const paramNames = [];
        const regexPath = path.replace(/:([^/]+)/g, (_, key) => {
            paramNames.push(key);
            return '([^/]+)';
        });

        this.routes.push({
            method,
            path: new RegExp(`^${regexPath}$`),
            handler,
            paramNames,
        });
    }

    get(path, handler) {
        this.register('GET', path, handler);
    }

    post(path, handler) {
        this.register('POST', path, handler);
    }

    handle(req, res) {
        const { method, url: requestUrl } = req;
        const { pathname } = url.parse(requestUrl, true);

        const middlewareChain = [...this.middlewares];//validate

        const runMiddlewares = (index) => { //validate 1
            if(index < middlewareChain.length) {
                middlewareChain[index](req, res, () => runMiddlewares(index + 1));
            }else { //validate 2
                for (const route of this.routes) {
                    const match = pathname.match(route.path);
                    if (match && route.method === method) {
                        const params = {};
                        route.paramNames.forEach((name, index) => {
                            params[name] = match[index + 1];
                        });
                        req.params = params;
                        return route.handler(req, res);
                    }
                }
                res.statusCode = 404;
                res.end('Not Found');
            }
        };

        runMiddlewares(0);//validate

    }
}

module.exports = Router;
