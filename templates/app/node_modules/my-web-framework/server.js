var http = require('http');
var treeRouter = require(__dirname + '/routes/treeRouter.js');

http.createServer((req, res) => {

  treeRouter.route(req, res);

}).listen(3000, () => console.log('server speaking.'));
