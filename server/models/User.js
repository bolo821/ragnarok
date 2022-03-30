const mariaDB = require("./DB.js");

const User = function(user) {
  this.userid = user.userid;
  this.wallet = user.wallet;
  this.user_pass = user.user_pass;
  this.verify = 0;
  this.group_id = 0;
  this.session = 0;
  if(user.email) {
    this.email = user.email;
  }
  if(user.master) {
    this.master = user.master;
  }
}

User.setSession = (account_id, value) => {
  mariaDB.query(`UPDATE login SET session='${value}' WHERE account_id = '${account_id}' `)
}

User.findById = (id, result) => {
  mariaDB.query(`SELECT * FROM login WHERE account_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

User.findMaster = (result) => {
  mariaDB.query(`SELECT * FROM login WHERE master IS NULL`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, []);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }
  });
};

User.findAll = (result) => {
  mariaDB.query(`SELECT * FROM login`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, []);
      return;
    }

    if (res.length) {
      result(null, res);
      return;
    }
  });
};

User.findOne = (data, result) => {
  let search = Object.keys(data);

  let searchkey = '';

  for (var i = 0; i < search.length; i++) {
    searchkey += search[i] + " = '" + data[search[i]] + "'";

    if(i < search.length - 1) {
      searchkey += ' and ';
    }
  }

  mariaDB.query(`SELECT * FROM login WHERE ${searchkey}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length > 0) {
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result(null, null);
  });
};

User.find = (data, result) => {
  let search = Object.keys(data);

  let searchkey = '';

  for (var i = 0; i < search.length; i++) {
    searchkey += search[i] + " = '" + data[search[i]] + "'";

    if(i < search.length - 1) {
      searchkey += ' and ';
    }
  }

  mariaDB.query(`SELECT * FROM login WHERE ${searchkey}`, (err, res) => {
    if (res.length > 0) {
      result(null, res);
      return;
    }

    // not found Tutorial with the id
    result(null, null);
  });
};

User.create = (newuser, result) => {
  let keys = Object.keys(newuser)
  let insertkey = '(';
  let insertvalue = '(';

  for (var i = 0; i < keys.length; i++) {
    insertkey += keys[i];
    insertvalue += "'"+newuser[keys[i]]+"'";

    if(i < keys.length - 1){
      insertkey += ', ';
      insertvalue += ', ';
    }
  }

  insertkey += ')';
  insertvalue += ')';
  mariaDB.query(`INSERT INTO login${insertkey} values${insertvalue}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newuser });
  });
};

User.update = (updateuser, user, result) => {
  let updatevalue = '';
  let keys = Object.keys(updateuser)

  for (var i = 0; i < keys.length; i++) {
    updatevalue += keys[i] + '=' + "'" + updateuser[keys[i]] + "'";

    if(i < keys.length - 1){
      updatevalue += ', ';
    }
  }

  mariaDB.query(`UPDATE login SET ${updatevalue} WHERE account_id = '${user}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, true);
  });
};

module.exports = User;