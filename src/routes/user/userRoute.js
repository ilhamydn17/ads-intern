const { appRouter } = require('../indexRoute');
// controllers
const { UserController } = require('../../controller/user/index');
// middlewares
const { verifyToken } = require('../../middleware/auth/verifyToken');
const { uploadImage } = require('../../middleware/user/uploadImage');

// appRouter.get('/api/users', [verifyToken], getListUser);
appRouter.get('/api/user-profile', [verifyToken], UserController.controllers.getUserProfile);
appRouter.put('/api/user-update-profile', [verifyToken, uploadImage], UserController.controllers.updateProfile);

module.exports = appRouter;