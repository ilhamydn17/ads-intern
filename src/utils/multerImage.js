const multer = require('multer');
const slug = require('slug');

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/storage/public');
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop().toLocaleLowerCase();
        const slugName = slug(file.originalname.slice(0, -extension.length));
        const dateNow = Date.now();
        const fileName = `${dateNow}-${slugName}.${extension}`;

        cb(null, fileName);
    }
});
const validatingImage = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('invalid file extension'), null);
    }
}

const multerImage = multer({
    storage: diskStorage,
    fileFilter: validatingImage,
    limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = { multerImage };