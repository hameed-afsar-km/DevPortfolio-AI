import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import {
  LayoutDashboard, Github, FileText, Brain, BarChart2,
  User, LogOut, ChevronRight, Zap, Globe
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
  { icon: Github, label: 'GitHub Analysis', id: 'github' },
  { icon: FileText, label: 'Resume', id: 'resume' },
  { icon: Brain, label: 'AI Insights', id: 'insights' },
  { icon: BarChart2, label: 'Skill Radar', id: 'skills' },
  { icon: User, label: 'Repositories', id: 'repos' },
]

export default function Sidebar({ active, setActive }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-64 min-h-screen bg-[#070d1a] border-r border-white/5 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
            <Zap size={16} className="relative z-10 text-white" />
          </div>
          <span className="font-bold text-sm gradient-text" style={{ fontFamily: 'Space Grotesk' }}>
            DevPortfolio AI
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 glass-card rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full gradient-btn flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            <span className="relative z-10">{user?.name?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Developer'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.githubUsername ? `@${user.githubUsername}` : user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1 mt-2">
        {navItems.map(({ icon: Icon, label, id }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`sidebar-link w-full text-left ${active === id ? 'active' : ''}`}
          >
            <Icon size={16} />
            <span>{label}</span>
            {active === id && <ChevronRight size={14} className="ml-auto text-blue-400" />}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link to="/portfolio" className="sidebar-link">
          <Globe size={16} />
          <span>My Portfolio</span>
        </Link>
        <button onClick={handleLogout} className="sidebar-link w-full text-left text-red-400 hover:text-red-300">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
