const mariaDB = require("./DB.js");

const Verify = function(verify) {
  this.code = verify.code;
  this.email = verify.email;
}

Verify.compare = (email, code, result) => {
  mariaDB.query(`SELECT * FROM verifycode WHERE email = '${email}' AND code = '${code}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, false);
      return;
    }

    if (res.length > 0) {
      result(null, res[0]);
      mariaDB.query(`DELETE from verifycode where email = '${email}'`, function(){})
      return;
    } else {
      result(null, false);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Verify.create = (newcode, result) => {
  let keys = Object.keys(newcode)
  let insertkey = '(';
  let insertvalue = '(';

  for (var i = 0; i < keys.length; i++) {
    insertkey += keys[i];
    insertvalue += "'"+newcode[keys[i]]+"'";

    if(i < keys.length - 1){
      insertkey += ', ';
      insertvalue += ', ';
    }
  }

  insertkey += ')';
  insertvalue += ')';
  mariaDB.query(`INSERT INTO verifycode ${insertkey} values${insertvalue}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newcode });
  });
}

module.exports = Verify;