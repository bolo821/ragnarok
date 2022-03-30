const mariadb = require('mariadb/callback');

const pool = mariadb.createConnection({
	host: process.env.DB_HOST, 
	user: process.env.DB_USER, 
	password: process.env.DB_PASSWORD,
	database: process.env.DB,
	port: 3306,
	connectionLimit: 5,
	acquireTimeout : 100000
});

pool.connect((error) => {
	if(error){
		console.log(error);
		return;
	}
	console.log('Database connnection successful.');
})

module.exports = pool;