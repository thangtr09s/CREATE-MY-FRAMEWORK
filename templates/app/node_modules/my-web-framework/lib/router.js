var Router = module.exports = function() {

  this.routes = {
    'GET': {},
    'POST': {},
    'PUT': {},
    'DELETE': {}
  };

  this.fm = require(__dirname+'/../lib/fileManager.js');
  this.plz = require(__dirname+'/../lib/responder.js');
};

Router.prototype.get = function(route, cb) {
  this.routes.GET[route] = cb;
};

Router.prototype.post = function(route, cb) {
  this.routes.POST[route] = cb;
};

Router.prototype.put = function(route, cb) {
  this.routes.PUT[route] = cb;
};

Router.prototype.del = function(route, cb) {
  this.routes.DELETE[route] = cb;
};

Router.prototype.route = function(req, res) {

  var resource = req.url.split('/')[1];
  if (typeof this.routes[req.method]['/'+resource] === 'function')
    this.routes[req.method]['/'+resource](req, res);
  else {
    console.log('no route hit return 404');
    res.writeHead(404, {'content-type': 'text/html'});
    res.write('<h1>im lost</h1>');
    res.end();
  }

  // try {
  //   console.log(req.method);
  //   console.log(req.url);
  //   var resource = req.url.split('/')[1];
  //   console.log(resource);
  //   this.routes[req.method]['/'+resource](req, res);
  // } catch (err) {
  //   console.log('no route hit return 404');
  //   res.writeHead(404, {'content-type': 'text/html'});
  //   res.write('<h1>im lost</h1>');
  //   res.end();
  // }
};

Router.prototype.respond = function(res, status, msg) {
  console.log(`returning ${status} with msg:${msg}`);
  res.writeHead(status, {'content-type': 'text/html'});
  if (msg) res.write(`${msg}\n`)
  res.end();
};

Router.prototype.respondErr = function(res, status, msg) {
  console.log(`returning error ${status} with msg:${msg}`);
  res.writeHead(status, {'content-type': 'text/html'});
  res.write(`sorry ${status} error\n`);
  if (msg) res.write(`${msg}\n`)
  res.end();
};
