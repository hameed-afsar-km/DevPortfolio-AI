const axios = require('axios')

// Simple in-memory cache
const cache = new Map()
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

const cachedGet = async (url, headers) => {
  const key = url
  const now = Date.now()
  if (cache.has(key)) {
    const { data, ts } = cache.get(key)
    if (now - ts < CACHE_TTL) return data
  }
  const res = await axios.get(url, { headers })
  cache.set(key, { data: res.data, ts: now })
  return res.data
}

const getGitHubHeaders = () => {
  const headers = { 'Accept': 'application/vnd.github.v3+json' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
  return headers
}

const getProfile = async (req, res) => {
  try {
    const username = req.query.username
    if (!username) return res.status(400).json({ message: 'Username is required' })

    const url = `https://api.github.com/users/${username}`
    const data = await cachedGet(url, getGitHubHeaders())
    res.json(data)
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ message: 'GitHub user not found' })
    if (err.response?.status === 403) return res.status(403).json({ message: 'GitHub API rate limit exceeded. Set GITHUB_TOKEN in .env' })
    res.status(500).json({ message: 'Failed to fetch GitHub profile' })
  }
}

const getRepos = async (req, res) => {
  try {
    const username = req.query.username
    if (!username) return res.status(400).json({ message: 'Username is required' })

    const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=50&type=public`
    const data = await cachedGet(url, getGitHubHeaders())
    res.json(data)
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ message: 'GitHub user not found' })
    if (err.response?.status === 403) return res.status(403).json({ message: 'GitHub API rate limit exceeded. Set GITHUB_TOKEN in .env' })
    res.status(500).json({ message: 'Failed to fetch GitHub repositories' })
  }
}

module.exports = { getProfile, getRepos }
