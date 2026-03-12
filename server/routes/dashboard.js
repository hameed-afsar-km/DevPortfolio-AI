const router = require('express').Router()
const { get, save } = require('../controllers/dashboardController')
const authMiddleware = require('../utils/authMiddleware')

// Dashboard data paths
router.get('/', authMiddleware, get)
router.post('/', authMiddleware, save)

module.exports = router
