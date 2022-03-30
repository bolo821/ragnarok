const mariaDB = require("./DB.js");

const AccBalanceTemp = function(data) {
  this.account_id = data.account_id;
  this.token = data.token;
  this.value = data.value;
  this.hash = data.hash;
}

AccBalanceTemp.findOne = (data, result) => {
  let search = Object.keys(data);

  let searchkey = '';

  for (var i = 0; i < search.length; i++) {
    searchkey += search[i] + " = '" + data[search[i]] + "'";

    if(i < search.length - 1) {
      searchkey += ' and ';
    }
  }

  mariaDB.query(`SELECT * FROM acc_balance WHERE ${searchkey}`, (err, res) => {
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

AccBalanceTemp.create = (newbalance, result) => {
  let keys = Object.keys(newbalance)
  let insertkey = '(';
  let insertvalue = '(';

  for (var i = 0; i < keys.length; i++) {
    insertkey += keys[i];
    insertvalue += "'"+newbalance[keys[i]]+"'";

    if(i < keys.length - 1){
      insertkey += ', ';
      insertvalue += ', ';
    }
  }

  insertkey += ')';
  insertvalue += ')';
  mariaDB.query(`INSERT INTO acc_balance_temp${insertkey} values${insertvalue}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newbalance });
  });
}

module.exports = AccBalanceTemp;