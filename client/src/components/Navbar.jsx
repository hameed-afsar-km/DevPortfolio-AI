import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar({ transparent = false }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent ? 'bg-transparent' : 'bg-[#050814]/90 backdrop-blur-xl border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
            <Zap size={16} className="text-white relative z-10" />
          </div>
          <span className="font-bold text-lg gradient-text" style={{ fontFamily: 'Space Grotesk' }}>
            DevPortfolio AI
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Home', path: '/' },
            { label: 'Features', path: '/#features' },
            { label: 'Recruiter', path: '/recruiter' },
          ].map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              className={`text-sm font-medium no-underline transition-colors ${
                isActive(path) ? 'text-blue-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-slate-300 hover:text-white no-underline transition-colors">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-300 hover:text-white no-underline transition-colors font-medium">
                Sign In
              </Link>
              <Link
                to="/register"
                className="gradient-btn px-4 py-2 rounded-lg text-sm font-semibold no-underline text-white"
              >
                <span>Get Started</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-slate-400" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0f1e] border-b border-white/5 px-6 py-4 flex flex-col gap-4">
          <Link to="/" className="text-sm text-slate-300 no-underline">Home</Link>
          <Link to="/recruiter" className="text-sm text-slate-300 no-underline">Recruiter Mode</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-slate-300 no-underline">Dashboard</Link>
              <button onClick={logout} className="text-sm text-red-400 text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-300 no-underline">Sign In</Link>
              <Link to="/register" className="gradient-btn px-4 py-2 rounded-lg text-sm font-semibold no-underline text-white text-center">
                <span>Get Started</span>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
