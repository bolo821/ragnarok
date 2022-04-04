// const config = require('config');
// const nodemailerHost = config.get('nodemailer.host')
// const nodemailerPort = config.get('nodemailer.port')
// const nodemailerUser = config.get('nodemailer.user')
// const nodemailerPass = config.get('nodemailer.pass')
const nodemailer = require('nodemailer');
const MailServer = require('../models/MailServer');

module.exports = (callback) => {
    MailServer.getServer((err, result) => {
        if (err) {
            return callback(null, null);
        } else {
            var transporter = nodemailer.createTransport({
                host: result.host,
                port: result.port,
                secure: true,
                auth: {
                    user: result.username,
                    pass: result.password,
                }
            });
            return callback(transporter, result);
        }
    })
}