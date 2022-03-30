const mariaDB = require("./DB.js");

const Character = function(item) {
  this.id = item.char_id;
  this.name = item.name;
  this.zeny = item.zeny;
}

Character.findById = (id, result) => {
  mariaDB.query('SELECT char_id, name, zeny FROM' + '`char`' + ` WHERE account_id = '${id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length > 0) {
      result(null, res);
    } else {
      result(null, []);
    }
    
    return;
  });
};

module.exports = Character;