const mariaDB = require("./DB.js");

const Mode = function(item) {
  this.host = item.host;
  this.port = item.port;
  this.username = item.username;
  this.password = item.password;
}

Mode.getServer = (result) => {
  mariaDB.query(`SELECT * FROM mailserver`, (err, res) => {
    if (err) {
      return result(err, null);
    }

    if (res.length) {
      return result(null, res[0]);
    } else {
        result(null, null);
    }
  });
};

Mode.update = (server, result) => {
  mariaDB.query(`UPDATE mailserver SET host = '${server.host}', port = ${server.port}, username = '${server.username}', password = '${server.password}' WHERE id = 1`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, true);
  });
};

Mode.create = (server, result) => {
    mariaDB.query(`INSERT into mailserver (id, host, port, username, password) VALUES (1, '${server.host}', '${server.port}', '${server.username}', '${server.password}')`, (err, res) => {
      if (err) {
          return result(err, null);
      } else {
          return result(null, true);
      }
    })
}

module.exports = Mode;