const { multerImage } = require('../../utils/multerImage');

const uploadImage = (req, res, next) => {
    multerImage.single('image')(req, res, err => {
        if (err) {
            res.status(400).json({ message: err.message });
            return;
        }
        next();
    });
}

module.exports = { uploadImage };