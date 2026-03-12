const router = require('express').Router()
const { analyze, generatePortfolio } = require('../controllers/aiController')
const authMiddleware = require('../utils/authMiddleware')

// AI routes are protected
router.post('/analyze', authMiddleware, analyze)
router.post('/portfolio', authMiddleware, generatePortfolio)

module.exports = router
