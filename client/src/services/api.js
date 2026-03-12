import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devportfolio_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data || err)
)

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
}

export const githubService = {
  getProfile: (username) => api.get(`/github/profile?username=${username}`),
  getRepos: (username) => api.get(`/github/repos?username=${username}`),
}

export const resumeService = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

export const aiService = {
  analyze: (data) => api.post('/ai/analyze', data),
  generatePortfolio: (data) => api.post('/ai/portfolio', data),
}

export const dashboardService = {
  get: () => api.get('/dashboard'),
  save: (data) => api.post('/dashboard', data),
}

export default api
