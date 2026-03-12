const router = require('express').Router()
const multer = require('multer')
const { upload } = require('../controllers/resumeController')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})

const uploadMiddleware = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('Only PDF format is allowed'))
  }
})

// Create uploads directory if it doesn't exist
const fs = require('fs')
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads')

router.post('/upload', uploadMiddleware.single('resume'), upload)

module.exports = router
