const { appRouter } = require('../indexRoute');
const { register, login, logout, refreshToken, verifyOTP } = require('../../controller/auth/index');
const { registerValidator } = require('../../middleware/validator/authValidator/registerValidator');
const { loginValidator } = require('../../middleware/validator/authValidator/loginValidator');

appRouter.post('/register', [registerValidator], register);
appRouter.post('/login', [loginValidator], login);
appRouter.delete('/logout', logout);
appRouter.get('/token', refreshToken);
appRouter.post('/verif-otp', verifyOTP);

module.exports = appRouter;
