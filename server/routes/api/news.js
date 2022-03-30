const multer = require('multer');
const router = require('express').Router();
const News = require('../../models/News');
const SERVER_URL = `${process.env.APP_URL}/news/`

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, './public/news');
        },
        filename(req, file, cb) {
            cb(null, `${new Date().getTime()}_${file.originalname}`);
        }
    }),
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png|bmp)$/)) {
            return cb(
                new Error('only upload files with jpg, jpeg, png, bmp format.')
            );
        }
        cb(undefined, true);
    }
});

router.post('/add', upload.single('image'), (req, res) => {
    const { link } = req.body;
    const { filename } = req.file;

    let newnews = new News({
        link,
        path: SERVER_URL + filename,
    });

    News.create(newnews, (err, createdNews) => {
        if (createdNews) {
            res.json({
                success: true,
            });
        } else {
            if (err)
                return res.status(500).json({
                errors: [{ msg: err.message || "Some error occurred while adding news." }]
            });
        }
    });
});

router.get('/', (req, res) => {
    News.findAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while finding user."
            });
        else res.send({ data });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    News.deleteById(id, (err, data) => {
        if (err) {
            res.status(500).json({
                errors: [{ msg: 'Internal server error.' }],
            });
        } else {
            res.json({
                success: true,
            });
        }
    })
})

module.exports = router;