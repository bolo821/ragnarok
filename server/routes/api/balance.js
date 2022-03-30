const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const AccBalance = require('../../models/AccBalance');
const AccBalanceTemp = require('../../models/AccBalanceTemp');
const Logs = require('../../models/Logs');
const UserBalance = require('../../models/UserBalance');
const UserFund = require('../../models/UserFund');
const config = require('config');


const nodemailerHost = config.get('nodemailer.host')
const nodemailerPort = config.get('nodemailer.port')
const nodemailerUser = config.get('nodemailer.user')
const nodemailerPass = config.get('nodemailer.pass')

const nodemailer = require('nodemailer');
const User = require('../../models/User');

var transporter = nodemailer.createTransport({
  host: nodemailerHost,
  port: nodemailerPort,
  secure: true,
  auth: {
    user: nodemailerUser,
    pass: nodemailerPass
  }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/list/:token', async (req, res) => {
  UserBalance.findAll(req.params.token, (err, data) => {
      if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding user."
      });
    else res.send(data);
  });
});

router.get('/fundlist/:token', async (req, res) => {
  UserFund.findAll(req.params.token, (err, data) => {
      if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding user."
      });
    else res.send(data);
  });
});

// @route    GET api/balance
// @desc     Get balance by user
// @access   Private
router.get('/:id/:token', async (req, res) => {
  AccBalance.findById(req.params.id, req.params.token, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding user."
      });
    else {
      res.send(data);
    } 
  });
});

// @route    POST api/balance/updatetempbalance
// @desc     Authenticate user & update temp token for confirmation
// @access   Public
router.post(
  '/updatetempbalance',
  auth,
  async (req, res) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const { account_id, amount , token, hash, message } = req.body;

    let newtempbalance = new AccBalanceTemp({
      account_id: account_id,
      token: token,
      value: amount,
      hash: hash,

    })

    AccBalanceTemp.create(newtempbalance, (err, data) => {
      Logs.create({
        account_id: account_id,
        message,
        hash,
        amount: amount,
        type : token,
        date: date + ' ' + time
      }, async (err, newlog) => {

        User.findOne({ account_id: account_id }, async (err, user) => {
          var emailContentToClient = {
            from: nodemailerUser,
            to: user.email,
            subject: 'You have deposited successfully.',
            html: `
            <html>
              <body>
                <div class="container" style="text-align: center;">
                  <div class="row" style="margin: 20px 0px;">
                    <div class="col-md-12">
                      <div class="text-center">
                        Thank you. ${message}
                      </div>
                    </div>
                  </div>
                </div>
              </body>
            </html>`
          }
    
          transporter.sendMail(emailContentToClient, function (error, body) {
            if(body) {
              return res.json(true)
            } else {
              return res.status(500).json({
                errors: [{ msg: "Something was wrong. Try again." }]
              });
            }
          })
        });
      })
    });
  }
);

router.post(
  '/updatebalance',
  auth,
  async (req, res) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const { account_id, amount, token, type } = req.body;

    AccBalance.findById(account_id, token, (err, data) => {
      if (data === false) {
        let balance = {
          account_id: account_id,
          token: token,
          value: amount
        }
        AccBalance.create(balance, (err, data) => {
          return res.json(true)
        });
      } else {
        let updateAmount = 0;
        if (type === 'withdraw') {
          updateAmount = Number(data.value) + Number(amount);
        } else {
          updateAmount = Number(data.value) - Number(amount);
        }
        if (updateAmount >= 0) {
          AccBalance.update({ value: updateAmount }, { account_id: account_id, token }, (err, data) => {
            if (data === true) {
              res.send(true) ;
            } else {
              res.send(false) ;
            }
          });
        } else {
          res.send(false) ;
        }
      }
    });
  }
);

module.exports = router;