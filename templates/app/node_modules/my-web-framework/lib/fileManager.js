var fs = require('fs');

exports.read = function(resource, id, Class, fn) {
  fs.readFile(__dirname + '/../data/'+resource+'.json', (err, data) => {
    if (err) return fn(err, {'status':500, 'msg':`error reading from ${resource}.json`});

    var objs = JSON.parse(data)[resource].map((d) => new Class(d));

    if (!id) return fn(null, {'status':200, 'all':objs});//return treeRouter.respond(res, 200, `<h2>${treeRouter.plz.listAll(trees)}</h2>`);

    var matches = objs.filter((obj) => obj.id === id);
    var obj = matches[0] || new Class({'id':'park_bench@55&55'});

    return fn(null, {'status':200, 'delivery':obj}); //return treeRouter.respond(res, 200, '<h1>'+tree.name()+'</h1>');
  });
};

exports.create = function(resource, obj, fn) {

  fs.readFile(__dirname + '/../data/'+resource+'.json', (err, data) => {
    if (err) return fn(err, {'status':500, 'msg':`error reading from ${resource}.json`});  //this.router.respondErr(res, 500, "error reading from trees.json");

    var objs = JSON.parse(data)[resource];

    //keep resource unique
    if (objs.filter((o) => o.id === obj.id).length) return fn(null, {'status':200});//{this.router.respond(res, 200)};
    objs.push(obj);

    var toJSON = {};
    toJSON[resource] = objs;
    fs.writeFile(__dirname + '/../data/'+resource+'.json', JSON.stringify(toJSON), (err) => {
      console.log(`WRITE ${obj.id} to ${resource}.json`);
      if (err) return fn(err, {'status':500, 'msg':`error writing to ${resource}.json`});  //this.router.respondErr(res, 500, `error writing to ${resource}.json`);
      return fn(null, {'status':200});
    });
  });
};

exports.update = function(resource, id, updateObjTmp, Class, fn) {
  fs.readFile(__dirname + '/../data/'+resource+'.json', (err, data) => {
    if (err) return fn(err, {'status':500, 'msg':`error reading from ${resource}.json`});

    var objs = JSON.parse(data)[resource].map((d) => new Class(d));

    if (!id) return fn(null, {'status':200});

    //update id matches to update
    objs.forEach((obj, i, arr) => { if (obj.id === id) arr[i] = new Class(JSON.parse(updateObjTmp));  });

    var toJSON = {};
    toJSON[resource] = objs;
    fs.writeFile(__dirname + '/../data/'+resource+'.json', JSON.stringify(toJSON), (err) => {
      if (err) return fn(err, {'status':500, 'msg':`error writing to ${resource}.json`});
      console.log(`WRITE ${id} to trees.json`);
      return fn(null, {'status':200});
    });
  });
};

exports.delete = function(resource, id, Class, fn) {
  if (!id) return treeRouter.respond(res, 200);

  fs.readFile(__dirname + '/../data/'+resource+'.json', (err, data) => {
    if (err) return fn(err, {'status':500, 'msg':`error reading from ${resource}.json`});

    var objs = JSON.parse(data)[resource].map((d) => new Class(d));

    //remove species with id from speciess
    objs.forEach((obj, i, arr) => { if (obj.id === id) arr.splice(i, 1);  });

    var toJSON = {};
    toJSON[resource] = objs;
    fs.writeFile(__dirname + '/../data/'+resource+'.json', JSON.stringify(toJSON), (err) => {
      if (err) return fn(err, {'status':500, 'msg':`error writing to ${resource}.json`});
      console.log(`DELETE ${id} from trees.json`);
      return fn(null, {'status':200});
    });
  });
};
