const router = require('express').Router();
const MailServer = require('../../models/MailServer');
const nodemailer = require('nodemailer');

router.post('/', (req, res) => {
    try {
        var transporter = nodemailer.createTransport({
            host: req.body.host,
            port: req.body.port,
            secure: true,
            auth: {
                user: req.body.username,
                pass: req.body.password,
            }
        });
        var emailContentToClient = {
            from: req.body.username,
            to: 'glorybolo@outlook.com',
            subject: 'Test',
            html: `
            <html>
              <body>
                <div class="container" style="text-align: center;">
                  <div class="row" style="margin: 20px 0px;">
                    <div class="col-md-12">
                      <div class="text-center">
                        This is test mail to check the mail server.
                      </div>
                    </div>
                  </div>
                </div>
              </body>
            </html>`
        }

        transporter.sendMail(emailContentToClient, function (error, body) {
            if (body) {
                MailServer.getServer((err, data) => {
                    if (err) {
                        res.status(500).send({
                            message:
                                err.message || "Internal server error."
                        });
                    } else {
                        if (data) {
                            MailServer.update(req.body, (err, rlt) => {
                                if (err) {
                                    res.json({ message: 'Internal server error.' });
                                } else {
                                    res.json({ success: true });
                                }
                            });
                        } else {
                            MailServer.create({ ...req.body, id: 1 }, (err, rlt) => {
                                if (err) {
                                    res.json({ message: 'Internal server error.' });
                                } else {
                                    res.json({ success: true });
                                }
                            })
                        }
                    }
                });
            } else {
                return res.status(500).json({
                    message: "Mail server is not valid. Please try with another one.",
                });
            }
        });
    } catch (err) {
        console.log('error: ', err);
        res.status(500).json({
            message: err.message || "Internal server error."
        });
    }
});

module.exports = router;