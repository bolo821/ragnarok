const router = require('express').Router();
const Mode = require('../../models/Mode');
const auth = require('../../middleware/auth');

exports.getMode = () => {
    try {
        Mode.getMode((err, data) => {
            if (err) {
                return null;
            } else {
                return data;
            }
        });
    } catch (err) {
        console.log('error: ', err);
        return null;
    }
}
router.get('/', (req, res) => {
    try {
        Mode.getMode((err, data) => {
            if (err) {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while finding user."
                });
            } else {
                res.json({
                    mode: data,
                })
            }
        });
    } catch (err) {
        console.log('error: ', err);
        res.status(500).json({
            message: err.message || "Internal server error."
        });
    }
});

router.put('/:mode', auth, (req, res) => {
    const { mode } = req.params;
    try {
        Mode.update(mode, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || "Internal server error."
                });
            } else {
                res.json({
                    success: true,
                })
            }
        });
    } catch (err) {
        console.log('error: ', err);
        res.status(500).json({
            message: err.message || "Internal server error."
        });
    }
})

module.exports = router;