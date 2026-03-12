const User = require('../models/User')
const { generateToken } = require('../utils/jwt')

const register = async (req, res) => {
  try {
    const { name, email, password, githubUsername } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    // Check if DB is connected
    const isDbConnected = require('mongoose').connection.readyState === 1

    if (isDbConnected) {
      const existing = await User.findOne({ email })
      if (existing) return res.status(409).json({ message: 'Email already registered' })
      const user = await User.create({ name, email, password, githubUsername: githubUsername || '' })
      const token = generateToken(user._id)
      return res.status(201).json({ token, user: user.toPublic() })
    } else {
      // No-DB mode: generate a mock token for development
      const mockId = `dev_${Date.now()}`
      const token = generateToken(mockId)
      return res.status(201).json({
        token,
        user: { id: mockId, name, email, githubUsername: githubUsername || '' },
        warning: 'Running without database — data not persisted',
      })
    }
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Registration failed' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const isDbConnected = require('mongoose').connection.readyState === 1

    if (isDbConnected) {
      const user = await User.findOne({ email })
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
      const token = generateToken(user._id)
      return res.json({ token, user: user.toPublic() })
    } else {
      // No-DB mode: allow any login for development
      const mockId = `dev_${email}`
      const token = generateToken(mockId)
      return res.json({
        token,
        user: { id: mockId, name: email.split('@')[0], email },
        warning: 'Running without database',
      })
    }
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Login failed' })
  }
}

module.exports = { register, login }
