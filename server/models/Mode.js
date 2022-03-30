const mariaDB = require("./DB.js");

const Mode = function(item) {
  this.mode = item.mode;
}

Mode.getMode = (result) => {
  mariaDB.query(`SELECT * FROM mode`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0].mode);
      return;
    }
  });
};

Mode.update = (mode, result) => {
  mariaDB.query(`UPDATE mode SET mode='${mode}' WHERE id = 1`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, true);
  });
};

module.exports = Mode;