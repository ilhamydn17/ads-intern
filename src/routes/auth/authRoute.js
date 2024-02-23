const { appRouter } = require('../indexRoute');
const authController = require('../../controller/auth/authController');
const { registerValidator } = require('../../middleware/validator/authValidator/registerValidator');
const { loginValidator } = require('../../middleware/validator/authValidator/loginValidator');

appRouter.post('/register', [registerValidator], authController.register);
appRouter.post('/login', [loginValidator], authController.login);
appRouter.delete('/logout', authController.logout);
appRouter.get('/api/token', authController.refreshToken);

module.exports = appRouter;
