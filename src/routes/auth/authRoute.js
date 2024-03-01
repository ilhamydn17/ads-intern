const { appRouter } = require('../indexRoute');
// const { register, login, logout, refreshToken, verifyOTP } = require('../../controller/auth/index');
const { registerValidator } = require('../../middleware/validator/authValidator/registerValidator');
const { loginValidator } = require('../../middleware/validator/authValidator/loginValidator');
const { AuthController } = require('../../controller/auth/index');

appRouter.post('/register', [registerValidator], AuthController.controllers.register);
appRouter.post('/login', [loginValidator], AuthController.controllers.login);
appRouter.delete('/logout', AuthController.controllers.logout);
appRouter.get('/token', AuthController.controllers.refreshToken);
appRouter.post('/verif-otp', AuthController.controllers.verifyOTP);

module.exports = appRouter;
