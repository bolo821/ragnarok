const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config');
const { check, validationResult } = require('express-validator');
var crypto = require('crypto');

const User = require('../../models/User');
const Logs = require('../../models/Logs');
const AccBalance = require('../../models/AccBalance');

const nodemailerHost = config.get('nodemailer.host')
const nodemailerPort = config.get('nodemailer.port')
const nodemailerUser = config.get('nodemailer.user')
const nodemailerPass = config.get('nodemailer.pass')

const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: nodemailerHost,
  port: nodemailerPort,
  secure: true,
  auth: {
    user: nodemailerUser,
    pass: nodemailerPass
  }
});

router.post(
  '/subaccount',
  auth,
  check('userid', 'Name is required').notEmpty(),
  // check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userid, password, wallet } = req.body;

    try {
      User.findOne({ userid }, async (err, data) => {
        if (err)
          return res.status(500).json({
            errors: [{ msg: err.message || "Some error occurred while creating a new subuser." }]
          });

        if (data) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'User already exists' }] });
        }

        let newuser = new User({
          userid,
          wallet,
          master: req.user.account_id,
        });

        var hash = crypto.createHash('md5').update(password).digest('hex');

        newuser.user_pass = hash;

        User.create(newuser, (err, createduser) => {
          if (createduser) {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

            Logs.create({
              account_id: req.user.account_id,
              message: `Created a new subuser ${userid}`,
              type : 'NEW_SUBUSER',
              date: date + ' ' + time,
              amount: 1,
              hash: null,
            }, (err, newlog) => {
              User.find({master: req.user.account_id}, (err, users) => {
                if (err)
                  return res.status(500).json({
                    errors: [{ msg: err.message || "Some error occurred while creating the User." }]
                  });
                res.json({ users });
              });
            });

            
          } else {
            if (err)
              return res.status(500).json({
                errors: [{ msg: err.message || "Some error occurred while creating the User." }]
              });
          }
        })
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get(
  '/subaccount',
  auth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      User.find({master: req.user.account_id}, (err, users) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        if(users === null) 
          res.json({ users: [] });
        else
          res.json({ users });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get('/master', auth, async (req, res) => {
  try {
    User.findMaster((err, users) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      } else {
        res.json(users);
      }
    });
  } catch (err) {
    console.log('error: ', err);
    res.status(500).send({
      message: err.message || "Internal server error.",
    });
  }
});

router.get(
  '/list',
  auth,
  async (req, res) => {
    try {
      User.findAll((err, users) => {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        } else {
          res.json(users);
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/coin',
  auth,
  async (req, res) => {
   
    const { account_id, amount, token } = req.body;
    console.log('account_id', account_id)
    AccBalance.findById(account_id, token, (err, data) => {
      if (data == false) {
        let balance = {
          account_id: account_id,
          token: token,
          value: amount
        }
        AccBalance.create(balance, (err, data) => {
          return res.json(true)
        });
      } else {
        let newvalue = Number(data.value) + Number(amount);
        AccBalance.update({ value: newvalue }, { account_id: account_id, token }, (err, data) => {
          if (data == true) {
            return res.json(true);
          } else {
            return res.json(false);
          }
        });
      }
    });

    try {
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/mail',
  auth,
  async (req, res) => {
    const { email, title, content } = req.body;
    try {
      var emailContentToClient = {
        from: nodemailerUser,
        to: email,
        subject: title,
        html: `
        <html>
          <body>
            <div class="container" style="text-align: center;">
              <div class="row" style="margin: 20px 0px;">
                <div class="col-md-12">
                  <div class="text-center">
                    ${content}
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>`
      }

      transporter.sendMail(emailContentToClient, function (error, body) {
        if(body) {
          res.json({
            success: true
          })
        } else {
          return res.status(500).json({
            errors: [{ msg: "Something was wrong. Try again." }]
          });
        }
      })
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.put('/ban/:account_id', auth, (req, res) => {
  try {
    User.update({ state: req.body.state }, req.params.account_id, (err, users) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      } else {
        res.json({ success: true });
      }
    });
  } catch (err) {
    console.log('error: ', err);
    res.status(500).send({
      message: err.message || "Internal server error.",
    });
  }
})

module.exports = router;
