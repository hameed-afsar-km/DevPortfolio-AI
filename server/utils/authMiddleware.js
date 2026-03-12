const { verifyToken } = require('../utils/jwt')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized — no token' })
    }
    const token = header.split(' ')[1]
    const decoded = verifyToken(token)

    // If MongoDB is connected, fetch user; otherwise use token payload
    if (req.app.get('dbConnected')) {
      const user = await User.findById(decoded.id).select('-password')
      if (!user) return res.status(401).json({ message: 'User not found' })
      req.user = user
    } else {
      req.user = { _id: decoded.id, id: decoded.id }
    }

    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware
