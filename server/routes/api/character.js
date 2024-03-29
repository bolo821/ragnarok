const router = require('express').Router();
const Character = require('../../models/Character');
const auth = require('../../middleware/auth');

router.post('/', auth, (req, res) => {
    const { account_id } = req.body;

    Character.findById(account_id, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while finding user."
            });
        else res.send({ data });
    });
})

module.exports = router;