const mongoose = require('mongoose')

const DashboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  githubData: { type: mongoose.Schema.Types.Mixed },
  resumeData: { type: mongoose.Schema.Types.Mixed },
  aiInsights: { type: mongoose.Schema.Types.Mixed },
  updatedAt: { type: Date, default: Date.now },
})

DashboardSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model('Dashboard', DashboardSchema)
