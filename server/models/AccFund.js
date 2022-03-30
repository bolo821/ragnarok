const mariaDB = require("./DB.js");

const AccFund = function(wallet) {
  this.account_id = wallet.account_id;
  this.token = wallet.token;
  this.value = 0;
}

AccFund.findById = (account_id, token, result) => {
  mariaDB.query(`SELECT * FROM acc_fund WHERE account_id = '${account_id}' and token = '${token}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length > 0) {
      result(null, res[0]);
      return;
    } else {
     
      result(null, false);
      return;
    }
  });
};

AccFund.create = (newbalance, result) => {
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
  mariaDB.query(`INSERT INTO acc_fund${insertkey} values${insertvalue}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newbalance });
  });
}

AccFund.update = (updatebalance, searchdata, result) => {
  let updatevalue = '';
  let keys = Object.keys(updatebalance)

  for (var i = 0; i < keys.length; i++) {
    updatevalue += keys[i] + '=' + "'" + updatebalance[keys[i]] + "'";

    if(i < keys.length - 1){
      updatevalue += ', ';
    }
  }

  let search = Object.keys(searchdata);

  let searchkey = '';

  for (var i = 0; i < search.length; i++) {
    searchkey += search[i] + " = '" + searchdata[search[i]] + "'";

    if(i < search.length - 1) {
      searchkey += ' and ';
    }
  }



  mariaDB.query(`UPDATE acc_fund SET ${updatevalue} WHERE ${searchkey}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, true);
  });
};

module.exports = AccFund;