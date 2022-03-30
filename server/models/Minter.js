const mariaDB = require("./DB.js");

const Minter = function(item) {
  this.id = item.id;
  this.path = item.path;
  this.link = item.link;
}

Minter.findAll = (result) => {
  mariaDB.query(`SELECT * from minter`, (err, res) => {
    if (res.length > 0) {
        result(null, res);
    } else {
        result(null, []);
    }
  });
};

module.exports = Minter;