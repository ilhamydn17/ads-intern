const { db } = require('../../models')
const User = db.loggedUser

const logout = async (req, res) => {
  try {
    // get information refreshToken from cookie
    const refreshTokenOnCookie = req.cookies.refreshToken
    if (!refreshTokenOnCookie) return res.status(204)

    // find user by refreshToken
    const loggedUser = await User.findOne({
      where: { refreshToken: refreshTokenOnCookie },
    })
    if (!loggedUser) return res.status(204)

    // update refreshToken and otp user become null
    await loggedUser.update({ refreshToken: null, otp: null })

    // clear cookie for refreshToken
    res.clearCookie('refreshToken')

    res.status(204).json({ message: 'Logout success' })
  } catch (error) {
    console.log(`error: ${error}`)
    res.status(500).json('message : internal server error')
  }
}

module.exports = logout