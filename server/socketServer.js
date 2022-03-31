var users = {};
var users_in_transaction = [];
const User = require('./models/User');

module.exports = (server, options) => {
	const io = require('socket.io')(server, options);

	io.on('connection', (socket) => {
		socket.on('CONNECT', (account_id, callback) => {
			if (Object.values(users).includes(account_id)) {
				callback(false);
			} else {
				callback(true);
			}
		});

		socket.on('SET_SESSION', account_id => {
			User.setSession(account_id, 1);
			users = { ...users, [ socket.id ]: account_id };
		});

		socket.on('disconnect', () => {
			User.setSession(users[socket.id], 0);
			delete users[socket.id];
		});

		socket.on('DISCONNECT', () => {
			User.setSession(users[socket.id], 0);
			delete users[socket.id];
		});

		socket.on('START_TRANSACTION', (account_id, callback) => {
			if (users_in_transaction.includes(account_id)) {
				callback(false);
			} else {
				users_in_transaction.push(account_id);
				callback(true);
			}
		});

		socket.on('END_TRANSACTION', account_id => {
			users_in_transaction = users_in_transaction.filter(ele => {
				if (ele === account_id) return false;
				return true;
			});
		});

		socket.on('MOVE_TO_MAINTENANCE_MODE', () => {
			socket.broadcast.emit('MOVE_TO_MAINTENANCE_MODE');
			users = { [socket.id]: users[socket.id] };
			users_in_transaction = [];
		});

		socket.on('FORCE_LOGOUT', account_id => {
			for (ele in users) {
				if (users[ele] === account_id) {
					io.to(ele).emit('FORCE_LOGOUT');
					break;
				}
			}
		})
	});
}