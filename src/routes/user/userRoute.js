const { appRouter } = require('../indexRoute');
const { getListUser, getUserProfile, storeImage } = require('../../controller/user/userController');
const { verifyToken } = require('../../middleware/auth/verifyToken');
const { uploadImage } = require('../../middleware/user/uploadImage');

appRouter.get('/api/users', [verifyToken], getListUser);
appRouter.get('/api/user-profile', [verifyToken], getUserProfile);
appRouter.post('/api/image-upload', uploadImage, storeImage);

module.exports = appRouter;