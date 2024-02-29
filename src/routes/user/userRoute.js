const { appRouter } = require('../indexRoute');
const { getListUser, getUserProfile } = require('../../controller/user/userController');
const { verifyToken } = require('../../middleware/auth/verifyToken');

appRouter.get('/api/users', [verifyToken], getListUser);
appRouter.get('/api/user-profile', [verifyToken], getUserProfile);

module.exports = appRouter;