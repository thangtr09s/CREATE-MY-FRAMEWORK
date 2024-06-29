var Species = module.exports = function(tmp) {
  console.log('make new species');
  console.log(tmp);
  this.id = tmp.id;
};

Species.prototype.name = function() {
  return this.id.replace("_", " ");
};

Species.prototype.listHTML = function() {
  return `<a href='/speciess/${this.id}'>${this.name()}</a>`;
};

// Species.prototype.linkHTML = function() {
//   return `<a href='/speciess/${this.id}'>${this.name()}</a>`;
// }
