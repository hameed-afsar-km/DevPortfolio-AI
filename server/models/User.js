const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  githubUsername: { type: String, trim: true, default: '' },
  createdAt: { type: Date, default: Date.now },
  lastAnalysis: { type: Date },
  dashboardData: { type: mongoose.Schema.Types.Mixed },
})

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

UserSchema.methods.toPublic = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    githubUsername: this.githubUsername,
    createdAt: this.createdAt,
  }
}

module.exports = mongoose.model('User', UserSchema)
