const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Logs = require('../../models/Logs');

// @route    GET api/balance
// @desc     Get balance by user
// @access   Private
router.get('/:id', async (req, res) => {
  Logs.findById(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding user."
      });
    else res.send({data});
  });
});

module.exports = router;
