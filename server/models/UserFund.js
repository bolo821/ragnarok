const mariaDB = require("./DB.js");

const UserFund = function() {
  this.account_id = 0;
  this.email = null;
  this.userid = null;
  this.balance =0;
}

UserFund.findAll = (token,result) => {
  mariaDB.query(`SELECT login.account_id as account_id,  login.email as email, login.userid as userid, acc_fund.value as balance FROM login JOIN acc_fund ON login.account_id = acc_fund.account_id WHERE  acc_fund.token = '${token}'`, (err, res) => {
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



module.exports = UserFund;