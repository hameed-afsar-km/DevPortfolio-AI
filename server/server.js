require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
const path = require('path')

const authRoutes = require('./routes/auth')
const githubRoutes = require('./routes/github')
const resumeRoutes = require('./routes/resume')
const aiRoutes = require('./routes/ai')
const dashboardRoutes = require('./routes/dashboard')

const app = express()
const PORT = process.env.PORT || 5000

// Security
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' })
app.use('/api/', limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/github', githubRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' })
})

// Connect DB and start
const startServer = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI)
      console.log('✅ MongoDB connected')
    } else {
      console.log('⚠️  No MONGODB_URI set — running without database')
    }
    app.listen(PORT, () => {
      console.log(`🚀 DevPortfolio AI server running at http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message)
    // Start server anyway for development
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT} (no DB)`)
    })
  }
}

startServer()
