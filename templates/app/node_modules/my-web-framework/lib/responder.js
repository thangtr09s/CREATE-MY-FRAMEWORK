exports.listAll = function(arr) {
  return arr.reduce((acc, e) => {
    return acc += e.listHTML() + "</br>";
  }, "");
};
