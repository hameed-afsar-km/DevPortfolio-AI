const Dashboard = require('../models/Dashboard')

const get = async (req, res) => {
  try {
    const isDbConnected = require('mongoose').connection.readyState === 1
    if (!isDbConnected) return res.json({ message: 'No database connected' })

    const dashboard = await Dashboard.findOne({ userId: req.user._id })
    if (!dashboard) return res.json(null)
    res.json(dashboard)
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard' })
  }
}

const save = async (req, res) => {
  try {
    const isDbConnected = require('mongoose').connection.readyState === 1
    if (!isDbConnected) return res.json({ message: 'No database — data saved locally' })

    const { githubData, resumeData, aiInsights } = req.body
    const dashboard = await Dashboard.findOneAndUpdate(
      { userId: req.user._id },
      { githubData, resumeData, aiInsights, updatedAt: new Date() },
      { upsert: true, new: true }
    )
    res.json(dashboard)
  } catch (err) {
    res.status(500).json({ message: 'Failed to save dashboard' })
  }
}

module.exports = { get, save }
