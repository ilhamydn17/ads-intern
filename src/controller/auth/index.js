const login = require('./login')
const register = require('./register')
const logout = require('./logout')
const refreshToken = require('./refreshToken')
const verifyOTP = require('./verifyOTP')

module.exports = {
    login,
    register,
    logout,
    refreshToken,
    verifyOTP
}