import { useState } from 'react'
import { Link } from 'react-router-dom'
import { githubService, aiService } from '../services/api'
import {
  Search, Zap, Github, Star, GitFork, Users, BarChart2,
  Brain, TrendingUp, AlertTriangle, CheckCircle2, ArrowLeft,
  Code2, Globe, Lightbulb, RefreshCw
} from 'lucide-react'
import LanguageChart from '../charts/LanguageChart'
import SkillRadar from '../charts/SkillRadar'
import StarsChart from '../charts/StarsChart'

export default function RecruiterMode() {
  const [username, setUsername] = useState('')
  const [githubData, setGithubData] = useState(null)
  const [aiReport, setAiReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!username.trim()) { setError('Enter a GitHub username'); return }
    setLoading(true)
    setAiReport(null)
    setError('')
    try {
      const [profile, repos] = await Promise.all([
        githubService.getProfile(username),
        githubService.getRepos(username),
      ])
      setGithubData({ profile, repos })
      // Auto-run AI analysis
      setAiLoading(true)
      try {
        const ai = await aiService.analyze({ githubData: { profile, repos }, username })
        setAiReport(ai)
      } catch { /* AI optional */ }
      setAiLoading(false)
    } catch (e) {
      setError(e.message || 'GitHub user not found.')
    } finally {
      setLoading(false)
    }
  }

  const profile = githubData?.profile
  const repos = githubData?.repos || []
  const totalStars = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0)

  const languages = repos.reduce((acc, r) => {
    if (r.language) acc[r.language] = (acc[r.language] || 0) + 1
    return acc
  }, {})
  const langPercent = Object.fromEntries(
    Object.entries(languages).map(([k, v]) => [k, Math.round((v / repos.length) * 100)])
  )

  const devScore = profile ? (() => {
    let s = 30
    if (repos.length > 5) s += 10
    if (repos.length > 20) s += 10
    if (totalStars > 50) s += 10
    if (totalStars > 200) s += 10
    if (Object.keys(languages).length > 3) s += 10
    if (profile.followers > 10) s += 5
    if (profile.followers > 100) s += 5
    return Math.min(s, 100)
  })() : 0

  return (
    <div className="min-h-screen bg-[#050814] grid-bg">
      {/* Header */}
      <div className="bg-[#070d1a] border-b border-white/5 px-8 py-4 flex items-center gap-4">
        <Link to="/" className="text-slate-400 hover:text-white transition-colors no-underline flex items-center gap-1.5 text-sm">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md gradient-btn flex items-center justify-center">
            <Zap size={11} className="relative z-10 text-white" />
          </div>
          <span className="font-semibold text-white text-sm">DevPortfolio AI</span>
          <span className="tag-pill ml-1">Recruiter Mode</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
            <Users size={14} /> Recruiter Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>
            Instant Candidate <span className="gradient-text">Analysis</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Paste any GitHub username to instantly generate a comprehensive developer report — skills, quality, activity, and AI insights.
          </p>
        </div>

        {/* Search */}
        <div className="glass-card p-6 max-w-2xl mx-auto mb-12 rounded-2xl">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Github size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="form-input pl-11 text-base"
                placeholder="Enter GitHub username (e.g. torvalds)"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
            <button onClick={handleAnalyze} disabled={loading} className="gradient-btn px-6 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center gap-2">
              <span className="flex items-center gap-2">
                <Search size={16} />
                {loading ? 'Analyzing...' : 'Generate Report'}
              </span>
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-3 flex items-center gap-2"><AlertTriangle size={14} />{error}</p>}
        </div>

        {/* Report */}
        {profile && (
          <div className="space-y-8">
            {/* Profile */}
            <div className="glass-card p-6 flex items-center gap-6">
              <img src={profile.avatar_url} alt="avatar" className="w-20 h-20 rounded-full border-2 border-blue-500/30 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white">{profile.name || profile.login}</h2>
                <p className="text-slate-400 text-sm mt-1">{profile.bio || 'Developer'}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><Users size={13} />{profile.followers} followers</span>
                  <span className="flex items-center gap-1"><Github size={13} />{profile.public_repos} repos</span>
                  {profile.company && <span>🏢 {profile.company}</span>}
                  {profile.location && <span>📍 {profile.location}</span>}
                </div>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="text-4xl font-black gradient-text">{devScore}</div>
                <div className="text-xs text-slate-400">Dev Score</div>
                <div className="text-xs text-blue-400 mt-1">
                  {devScore >= 80 ? '🔥 Expert' : devScore >= 60 ? '⭐ Advanced' : devScore >= 40 ? '📈 Intermediate' : '🌱 Junior'}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Stars', value: totalStars, icon: Star, color: '#f59e0b' },
                { label: 'Repositories', value: repos.length, icon: Github, color: '#3b82f6' },
                { label: 'Top Language', value: Object.entries(languages).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A', icon: Code2, color: '#8b5cf6' },
                { label: 'Tech Diversity', value: `${Object.keys(languages).length} langs`, icon: BarChart2, color: '#10b981' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="glass-card p-4 text-center stat-card">
                  <Icon size={20} className="mx-auto mb-2" style={{ color }} />
                  <div className="text-xl font-bold text-white">{value}</div>
                  <div className="text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Language Distribution</h3>
                <LanguageChart languages={Object.keys(langPercent).length ? langPercent : undefined} />
              </div>
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Repository Stars</h3>
                <StarsChart repos={repos} />
              </div>
            </div>

            {/* AI Report */}
            {aiLoading && (
              <div className="glass-card p-8 text-center">
                <RefreshCw size={24} className="text-blue-400 mx-auto mb-3 animate-spin" />
                <p className="text-slate-400">Generating AI candidate report...</p>
              </div>
            )}
            {aiReport && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-green-400 mb-4 flex items-center gap-2"><CheckCircle2 size={14} />Candidate Strengths</h3>
                  <ul className="space-y-2">
                    {(aiReport.strengths || []).map((s, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="text-green-400">✓</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-card p-6">
                  <h3 className="text-sm font-semibold text-yellow-400 mb-4 flex items-center gap-2"><Lightbulb size={14} />Career Path Fit</h3>
                  <div className="space-y-2">
                    {(aiReport.careerPaths || ['Frontend Engineer', 'Full Stack Developer', 'JavaScript Specialist']).map((p, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-yellow-500/8 border border-yellow-500/15">
                        <TrendingUp size={12} className="text-yellow-400 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {aiReport.summary && (
                  <div className="md:col-span-2 glass-card p-6 neon-border">
                    <h3 className="text-sm font-semibold text-violet-400 mb-3 flex items-center gap-2"><Brain size={14} />AI Candidate Summary</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{aiReport.summary}</p>
                  </div>
                )}
              </div>
            )}

            {/* Top Repos */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Notable Repositories</h3>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {repos.slice(0, 6).map(repo => (
                  <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="glass-card p-4 no-underline group">
                    <h4 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors mb-1">{repo.name}</h4>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{repo.description || 'No description'}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {repo.language && <span className="tag-pill">{repo.language}</span>}
                      <span className="flex items-center gap-1"><Star size={11} />{repo.stargazers_count || 0}</span>
                      <span className="flex items-center gap-1"><GitFork size={11} />{repo.forks_count || 0}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
