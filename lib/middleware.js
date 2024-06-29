//để tạo và xác thực JSON Web Tokens (JWT)
class Middleware {
    constructor() {
        this.middlewares = [];
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    runMiddlewares(req, res, done) {
        const next = (index) => {
            if (index >= this.middlewares.length) {
                done();
            } else {
                this.middlewares[index](req, res, () => next(index + 1));
            }
        };
        next(0);
    }
}

module.exports = Middleware;
