const { db } = require('../../models')
const User = db.user
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodeCache = require('node-cache')

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (refreshToken == null) {
      res.status(400).json({ message: 'refresh token not found' })
      return
    }
    const user = await User.findOne({ where: { refreshToken: refreshToken } })
    if (!user) {
      res.status(400).json({ message: 'user not found' })
      return
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.status(401).json({ message: 'refresh token has expired' })
          return
        } else {
          res.status(400).json({ message: 'refresh token not valid' })
          return
        }
      }
      const userId = user.id
      const userName = user.name
      const userEmail = user.email
      const newAccessToken = jwt.sign(
        { userId, userName, userEmail },
        process.env.ACCESS_TOKEN,
        { expiresIn: '1m' },
      )
      req.email = decoded.email
      res
        .status(200)
        .json({ message: 'success refresh token', accessToken: newAccessToken })
    })
  } catch (error) {
    console.log(`${error}`)
  }
}

module.exports = refreshToken