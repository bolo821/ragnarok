const mariaDB = require("./DB.js");

const UserBalance = function() {
  this.account_id = 0;
  this.email = null;
  this.userid = null;
  this.balance =0;
}

UserBalance.findAll = (token,result) => {
  mariaDB.query(`SELECT login.account_id as account_id,  login.email as email, login.userid as userid, acc_balance.value as balance FROM login JOIN acc_balance ON login.account_id = acc_balance.account_id WHERE  acc_balance.token = '${token}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length > 0) {
      result(null, res);
      return;
    } else {
      result(null, []);
      return;
    }
  });
};



module.exports = UserBalance;