const mariaDB = require("./DB.js");

const News = function(NewsItem) {
  this.id = NewsItem.id;
  this.path = NewsItem.path;
  this.link = NewsItem.link;
}

News.find = (data, result) => {
  let search = Object.keys(data);

  let searchkey = '';

  for (var i = 0; i < search.length; i++) {
    searchkey += search[i] + " = '" + data[search[i]] + "'";

    if(i < search.length - 1) {
      searchkey += ' and ';
    }
  }

  mariaDB.query(`SELECT * FROM news WHERE ${searchkey}`, (err, res) => {
    if (res.length > 0) {
      result(null, res);
      return;
    }
    result(null, null);
  });
};

News.findAll = (result) => {
  mariaDB.query(`SELECT * from news`, (err, res) => {
    if (res.length > 0) {
      result(null, res);
      return;
    }
    result(null, []);
  });
};

News.deleteById = (id, result) => {
  mariaDB.query(`DELETE FROM news WHERE id=${id}`, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return;
    } else {
      result(null, true);
    }
  })
}

News.findById = (id, result) => {
  mariaDB.query(`SELECT * FROM news WHERE id = '${id}' ORDER BY date DESC`, (err, res) => {
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

News.create = (newnews, result) => {
  let keys = Object.keys(newnews)
  let insertkey = '(';
  let insertvalue = '(';

  for (var i = 0; i < keys.length; i++) {
    insertkey += keys[i];
    insertvalue += "'"+newnews[keys[i]]+"'";

    if(i < keys.length - 1){
      insertkey += ', ';
      insertvalue += ', ';
    }
  }

  insertkey += ')';
  insertvalue += ')';
  mariaDB.query(`INSERT INTO news ${insertkey} values${insertvalue}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newnews });
  });
}

module.exports = News;