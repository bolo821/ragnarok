const router = require('express').Router();
const Minter = require('../../models/Minter');

router.get('/', (req, res) => {
    try {
        Minter.findAll((err, data) => {
            if (err) {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while finding user."
                });
            } else {
                // let payload = {
                //     address: data[0].address,
                //     key: data[0].key,
                // };
    
                // jwt.sign(
                //     payload,
                //     config.get('jwtSecret'),
                //     { expiresIn: 3600 },
                //     (err, token) => {
                //       if (err) throw err;
                //       return res.json({ token });
                //     }
                // );
                res.json({
                    key: data[0].key,
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