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
          err.message || "Some error occurred while finding logs."
      });
    else res.send({data});
  });
});

router.get('/', (req, res) => {
  Logs.findAll((err, data) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong while getting logs.' });
    } else {
      res.json({
        data: data,
      })
    }
  })
});

router.get('/interval/:start/:end', (req, res) => {
  const { start, end } = req.params;

  Logs.findByInterval(start, end, (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong while getting logs' });
    } else {
      res.json({
        data: data,
      });
    }
  });
})

module.exports = router;
