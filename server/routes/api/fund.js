const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const AccBalanceTemp = require('../../models/AccBalanceTemp');
const Logs = require('../../models/Logs');
const AccFund = require('../../models/AccFund');

// @route    GET api/balance
// @desc     Get balance by user
// @access   Private
router.get('/:id/:token', async (req, res) => {
  AccFund.findById(req.params.id, req.params.token, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding user."
      });
    else res.send(data);
  });
});

router.post(
  '/updatetempbalance',
  auth,
  async (req, res) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const { account_id, newvalue, currentvalue, token, hash, message } = req.body;

    let newtempbalance = new AccBalanceTemp({
      account_id: account_id,
      token: token,
      value: amount,
      hash: hash,

    })

    AccBalanceTemp.create(newtempbalance, (err, data) => {
      Logs.create({
        account_id: account_id,
        message, hash,
        amount: amount,
        type: token,
        date: date + ' ' + time
      }, async (err, newlog) => {
        return res.json(true)
      })
    });
    // AccBalance.update({ value: currentvalue + newvalue }, { account_id: account_id, token }, (err, data) => {
    //   if (data == true) {
    //     Logs.create({
    //       account_id: account_id,
    //       message, hash,
    //       date: date + ' ' + time
    //     }, async (err, newlog) => {
    //       return res.json(true)
    //     })
    //   } else {
    //     return res.json(false)
    //   }
    // });
  }
);


router.post(
  '/updatebalance',
  auth,
  async (req, res) => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const { account_id, amount, token, type, newvalue, currentvalue } = req.body;

    AccFund.findById(account_id, token, (err, data) => {
      if (data == false) {
        let balance = {
          account_id: account_id,
          token: token,
          value: amount
        }
        AccFund.create(balance, (err, data) => {
          return res.json(true)
        });
      } else {
        let updateAmount = 0;
        if (type === 'withdraw') {
          updateAmount = Number(data.value) + Number(amount);
        } else {
          updateAmount = Number(data.value) - Number(amount);
        }
        AccFund.update({ value: updateAmount }, { account_id: account_id, token }, (err, data) => {
          if (data === true) {
            res.send(true);
          } else {
            res.send(false);
          }
        });

      }
    });
  }
);

module.exports = router;
