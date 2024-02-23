const { appRouter } = require('../indexRoute');
const userController = require('../../controller/user/userController');
const { verifyToken } = require('../../middleware/auth/verifyToken');

appRouter.get('/api/users', [verifyToken], userController.getListUser);

module.exports = appRouter;
