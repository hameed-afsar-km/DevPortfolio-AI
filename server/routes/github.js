const router = require('express').Router()
const { getProfile, getRepos } = require('../controllers/githubController')

router.get('/profile', getProfile)
router.get('/repos', getRepos)

module.exports = router
