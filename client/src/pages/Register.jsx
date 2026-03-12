import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Zap, Mail, Lock, User, Github, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', githubUsername: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe' },
    { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'john@example.com' },
    { key: 'githubUsername', label: 'GitHub Username', icon: Github, type: 'text', placeholder: 'johndoe' },
  ]

  return (
    <div className="min-h-screen bg-[#050814] grid-bg flex items-center justify-center px-6 py-12">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-600/8 rounded-full blur-3xl animate-blob animation-delay-2000" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 no-underline">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center">
              <Zap size={20} className="relative z-10 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text" style={{ fontFamily: 'Space Grotesk' }}>DevPortfolio AI</span>
          </Link>
        </div>

        <div className="glass-card p-8 rounded-2xl neon-border">
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk' }}>Create your account</h1>
          <p className="text-slate-400 text-sm mb-8">Start analyzing your developer profile for free</p>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
              <div key={key}>
                <label className="text-sm text-slate-400 block mb-2">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={type}
                    className="form-input pl-10"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    required={key !== 'githubUsername'}
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="text-sm text-slate-400 block mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input pl-10 pr-10"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50"
            >
              <span>{loading ? 'Creating account...' : 'Create Free Account'}</span>
            </button>

            <p className="text-xs text-slate-500 text-center">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 no-underline font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
