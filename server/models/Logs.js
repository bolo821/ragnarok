const res = require("express/lib/response");
const mariaDB = require("./DB.js");

const Logs = function(LogItem) {
  this.account_id = LogItem.account_id;
  this.message = LogItem.message;
  this.hash = LogItem.hash;
  this.date = LogItem.date;
}

Logs.find = (data, result) => {
  let search = Object.keys(data);

  let searchkey = '';

  for (var i = 0; i < search.length; i++) {
    searchkey += search[i] + " = '" + data[search[i]] + "'";

    if(i < search.length - 1) {
      searchkey += ' and ';
    }
  }

  mariaDB.query(`SELECT * FROM logs WHERE ${searchkey}`, (err, res) => {
    if (res.length > 0) {
      result(null, res);
      return;
    }
    result(null, null);
  });
};

Logs.findAll = (result) => {
  mariaDB.query("SELECT login.userid as userid, login.wallet as wallet, `logs`.account_id as account_id, `logs`.message as message, `logs`.`hash` as `hash`, `logs`.date as date, `logs`.type as type, `logs`.amount as amount FROM `logs` JOIN login WHERE `logs`.account_id = login.account_id", (err, res) => {
    if (res.length > 0) {
      return result(null, res);
    }
    result(null, null);
  });
};

Logs.findByInterval = (start, end, result) => {
  mariaDB.query("SELECT login.userid as userid, login.wallet as wallet, `logs`.account_id as account_id, `logs`.message as message, `logs`.`hash` as `hash`, `logs`.date as date, `logs`.type as type, `logs`.amount as amount FROM `logs` JOIN login WHERE `logs`.account_id = login.account_id" + 
  ` AND date >= '${start}' AND date <= '${end}'`, (err, data) => {
    if (err) {
      return result(err, null);
    } else {
      if (data.length > 0) {
        result(null, data);
      } else {
        result(null, []);
      }
    }
  })
}

Logs.findById = (account_id, result) => {
  mariaDB.query(`SELECT * FROM logs WHERE account_id = '${account_id}' ORDER BY date DESC`, (err, res) => {
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

Logs.create = (newlog, result) => {
  let keys = Object.keys(newlog)
  let insertkey = '(';
  let insertvalue = '(';

  for (var i = 0; i < keys.length; i++) {
    insertkey += keys[i];
    insertvalue += "'"+newlog[keys[i]]+"'";

    if(i < keys.length - 1){
      insertkey += ', ';
      insertvalue += ', ';
    }
  }

  insertkey += ')';
  insertvalue += ')';
  mariaDB.query(`INSERT INTO logs ${insertkey} values${insertvalue}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newlog });
  });
}

module.exports = Logs;