import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Zap, Mail, Github, Globe, Code2, Star, GitFork, Download, Eye } from 'lucide-react'

export default function Portfolio() {
  const { user } = useAuth()
  const [portfolioData, setPortfolioData] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(`dashboard_${user?.email}`)
    if (stored) {
      const data = JSON.parse(stored)
      setPortfolioData({
        profile: data.githubData?.profile,
        repos: data.githubData?.repos || [],
        skills: data.aiInsights?.skills || {},
        strengths: data.aiInsights?.strengths || [],
      })
    }
  }, [user])

  const profile = portfolioData?.profile
  const repos = portfolioData?.repos || []
  const skills = portfolioData?.skills || { JavaScript: 80, React: 75, Python: 60, CSS: 70, Node: 55 }
  const topRepos = repos.filter(r => r.stargazers_count > 0 || r.description).slice(0, 6)

  const exportPortfolio = () => {
    const html = generatePortfolioHTML({ profile, repos: topRepos, skills, user })
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${user?.name || 'dev'}-portfolio.html`
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#050814]">
      {/* Portfolio Header */}
      <div className="bg-[#070d1a] border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-blue-400" />
          <span className="font-semibold text-white">Portfolio Preview</span>
          <span className="tag-pill ml-2">Live</span>
        </div>
        <button onClick={exportPortfolio} className="gradient-btn px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
          <span className="flex items-center gap-2"><Download size={14} />Export HTML</span>
        </button>
      </div>

      {/* Portfolio Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <section className="text-center mb-24">
          {profile?.avatar_url && (
            <img src={profile.avatar_url} alt="avatar" className="w-28 h-28 rounded-full border-4 border-blue-500/40 mx-auto mb-6 glow-blue" />
          )}
          <h1 className="text-5xl font-black mb-4 gradient-text" style={{ fontFamily: 'Space Grotesk' }}>
            {profile?.name || user?.name || 'Developer'}
          </h1>
          <p className="text-xl text-slate-300 mb-6">{profile?.bio || 'Full Stack Developer & Open Source Enthusiast'}</p>
          <div className="flex items-center justify-center gap-4 text-slate-400 text-sm">
            {profile?.location && <span>📍 {profile.location}</span>}
            {profile?.blog && <a href={profile.blog} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 no-underline"><Globe size={14}/>{profile.blog}</a>}
            {profile?.html_url && <a href={profile.html_url} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 no-underline" target="_blank" rel="noreferrer"><Github size={14}/>GitHub</a>}
          </div>
          <div className="flex items-center justify-center gap-3 mt-8">
            <a href={`mailto:${user?.email}`} className="gradient-btn px-6 py-3 rounded-xl font-semibold text-white no-underline text-sm">
              <span>Get In Touch</span>
            </a>
            <a href={profile?.html_url || '#'} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl font-semibold text-slate-300 no-underline text-sm border border-white/10 hover:border-blue-500/30 transition-colors">
              View GitHub
            </a>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-24">
          <h2 className="text-3xl font-black text-white mb-10 text-center" style={{ fontFamily: 'Space Grotesk' }}>
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(skills).map(([skill, level]) => (
              <div key={skill} className="glass-card p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white font-medium">{skill}</span>
                  <span className="text-blue-400">{level}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        {topRepos.length > 0 && (
          <section className="mb-24">
            <h2 className="text-3xl font-black text-white mb-10 text-center" style={{ fontFamily: 'Space Grotesk' }}>
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {topRepos.map(repo => (
                <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="glass-card p-5 no-underline group">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{repo.name}</h3>
                    <Code2 size={16} className="text-slate-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{repo.description || 'No description provided.'}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {repo.language && <span className="tag-pill">{repo.language}</span>}
                    <span className="flex items-center gap-1"><Star size={11} />{repo.stargazers_count || 0}</span>
                    <span className="flex items-center gap-1"><GitFork size={11} />{repo.forks_count || 0}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* GitHub Stats */}
        <section className="mb-24">
          <h2 className="text-3xl font-black text-white mb-10 text-center" style={{ fontFamily: 'Space Grotesk' }}>
            GitHub <span className="gradient-text">Analytics</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { label: 'Repositories', value: profile?.public_repos || repos.length, color: '#3b82f6' },
              { label: 'Followers', value: profile?.followers || 0, color: '#8b5cf6' },
              { label: 'Total Stars', value: repos.reduce((a, r) => a + (r.stargazers_count || 0), 0), color: '#f59e0b' },
              { label: 'Languages', value: [...new Set(repos.map(r => r.language).filter(Boolean))].length, color: '#10b981' },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass-card p-5 text-center">
                <div className="text-3xl font-black mb-1" style={{ color }}>{value}</div>
                <div className="text-xs text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-slate-400 mb-8">Open to collaborations, opportunities, and interesting projects.</p>
          <a href={`mailto:${user?.email}`} className="gradient-btn px-8 py-4 rounded-xl font-bold text-white no-underline inline-flex items-center gap-2 text-base">
            <span className="flex items-center gap-2"><Mail size={18} />Send me an email</span>
          </a>
        </section>
      </div>
    </div>
  )
}

function generatePortfolioHTML({ profile, repos, skills, user }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${profile?.name || user?.name} - Portfolio</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',sans-serif;background:#050814;color:#f1f5f9;overflow-x:hidden}
.hero{text-align:center;padding:80px 24px;background:linear-gradient(135deg,#050814,#0a0f1e)}
img{border-radius:50%;width:120px;height:120px;border:3px solid #3b82f6;margin-bottom:24px}
h1{font-size:3rem;font-weight:900;background:linear-gradient(135deg,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.subtitle{color:#94a3b8;font-size:1.1rem;margin:12px 0}
.section{max-width:900px;margin:60px auto;padding:0 24px}
.section h2{font-size:1.8rem;font-weight:800;margin-bottom:32px;text-align:center}
.card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:12px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}
a{color:#3b82f6;text-decoration:none}
</style>
</head>
<body>
<div class="hero">
  ${profile?.avatar_url ? `<img src="${profile.avatar_url}" alt="avatar">` : ''}
  <h1>${profile?.name || user?.name || 'Developer'}</h1>
  <p class="subtitle">${profile?.bio || 'Full Stack Developer'}</p>
  ${profile?.html_url ? `<a href="${profile.html_url}">View GitHub</a>` : ''}
</div>
<div class="section">
  <h2>Skills</h2>
  <div class="grid">
    ${Object.entries(skills).map(([s, l]) => `<div class="card"><strong>${s}</strong> — ${l}%</div>`).join('')}
  </div>
</div>
<div class="section">
  <h2>Projects</h2>
  <div class="grid">
    ${repos.map(r => `<div class="card"><h3>${r.name}</h3><p style="color:#94a3b8;font-size:0.875rem;margin:8px 0">${r.description || ''}</p><a href="${r.html_url}">View →</a></div>`).join('')}
  </div>
</div>
</body></html>`
}
