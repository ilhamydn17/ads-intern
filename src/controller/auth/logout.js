const { db } = require('../../models')
const User = db.user
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodeCache = require('node-cache')

const logout = async (req, res) => {
  try {
    const refreshTokenOnCookie = req.cookies.refreshToken
    if (!refreshTokenOnCookie) return res.status(204)
    const loggedUser = await User.findOne({
      where: { refreshToken: refreshTokenOnCookie },
    })
    if (!loggedUser) return res.status(204)
    await loggedUser.update({ refreshToken: null, otp: null })
    res.clearCookie('refreshToken')
    res.status(204).json({ message: 'Logout success' })
  } catch (error) {
    console.log(`error: ${error}`)
    res.status(500).json('message : internal server error')
  }
}

module.exports = logout