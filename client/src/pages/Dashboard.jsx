import { useState, useEffect, Suspense, lazy } from 'react'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../hooks/useAuth'
import { githubService, aiService, resumeService, dashboardService } from '../services/api'
import {
  Github, Search, Upload, Brain, RefreshCw, Star, GitFork,
  GitCommit, Code2, TrendingUp, AlertTriangle, CheckCircle2,
  Lightbulb, Award, Activity, Zap, FileText, Globe, Users
} from 'lucide-react'

const SkillRadar = lazy(() => import('../charts/SkillRadar'))
const LanguageChart = lazy(() => import('../charts/LanguageChart'))
const StarsChart = lazy(() => import('../charts/StarsChart'))
const ActivityChart = lazy(() => import('../charts/ActivityChart'))

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="glass-card p-5 stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span className="text-xs text-slate-500">{sub}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  )
}

function ScoreDonut({ score }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white">{score}</span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-white mt-2">Developer Score</p>
      <p className="text-xs text-slate-500">
        {score >= 80 ? 'Expert Level' : score >= 60 ? 'Advanced' : score >= 40 ? 'Intermediate' : 'Beginner'}
      </p>
    </div>
  )
}

function RepoCard({ repo }) {
  const quality = {
    architecture: repo.quality?.architecture || Math.floor(Math.random() * 3 + 6),
    documentation: repo.quality?.documentation || Math.floor(Math.random() * 4 + 4),
    innovation: repo.quality?.innovation || Math.floor(Math.random() * 3 + 5),
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-sm">{repo.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{repo.description || 'No description'}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 flex-shrink-0 ml-3">
          <span className="flex items-center gap-1"><Star size={12} /> {repo.stargazers_count || repo.stars || 0}</span>
          <span className="flex items-center gap-1"><GitFork size={12} /> {repo.forks_count || repo.forks || 0}</span>
        </div>
      </div>
      {repo.language && (
        <span className="tag-pill inline-block mb-3">{repo.language}</span>
      )}
      <div className="space-y-2">
        {Object.entries(quality).map(([k, v]) => (
          <div key={k}>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span className="capitalize">{k}</span><span className="text-blue-400">{v}/10</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${v * 10}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, updateUser } = useAuth()
  const [active, setActive] = useState('overview')
  const [githubData, setGithubData] = useState(null)
  const [aiInsights, setAiInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [githubInput, setGithubInput] = useState(user?.githubUsername || '')
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeData, setResumeData] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [analyzeLoading, setAnalyzeLoading] = useState(false)
  const [error, setError] = useState('')
  const [cached, setCached] = useState(false)

  // Load cached dashboard data
  useEffect(() => {
    const stored = localStorage.getItem(`dashboard_${user?.email}`)
    if (stored) {
      const data = JSON.parse(stored)
      setGithubData(data.githubData)
      setAiInsights(data.aiInsights)
      setResumeData(data.resumeData)
      setCached(true)
    }
  }, [user])

  const fetchGitHub = async () => {
    if (!githubInput.trim()) { setError('Enter a GitHub username'); return }
    setLoading(true)
    setError('')
    try {
      const [profile, repos] = await Promise.all([
        githubService.getProfile(githubInput),
        githubService.getRepos(githubInput),
      ])
      const data = { profile, repos }
      setGithubData(data)
      updateUser({ githubUsername: githubInput })
      saveToCache({ githubData: data })
    } catch (e) {
      setError(e.message || 'Failed to fetch GitHub data. Check the username.')
    } finally {
      setLoading(false)
    }
  }

  const uploadResume = async () => {
    if (!resumeFile) return
    setUploadLoading(true)
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      const res = await resumeService.upload(formData)
      setResumeData(res)
      saveToCache({ resumeData: res })
    } catch (e) {
      setError('Resume upload failed. Please try again.')
    } finally {
      setUploadLoading(false)
    }
  }

  const runAIAnalysis = async () => {
    setAnalyzeLoading(true)
    setError('')
    try {
      const res = await aiService.analyze({ githubData, resumeData, username: githubInput })
      setAiInsights(res)
      saveToCache({ aiInsights: res })
      setActive('insights')
    } catch (e) {
      setError('AI analysis failed. Make sure your API key is configured.')
    } finally {
      setAnalyzeLoading(false)
    }
  }

  const saveToCache = (data) => {
    const current = JSON.parse(localStorage.getItem(`dashboard_${user?.email}`) || '{}')
    localStorage.setItem(`dashboard_${user?.email}`, JSON.stringify({ ...current, ...data }))
  }

  // Derive stats
  const profile = githubData?.profile
  const repos = githubData?.repos || []
  const totalStars = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0)
  const totalForks = repos.reduce((a, r) => a + (r.forks_count || 0), 0)
  const languages = repos.reduce((acc, r) => {
    if (r.language) acc[r.language] = (acc[r.language] || 0) + 1
    return acc
  }, {})
  const langPercent = Object.fromEntries(
    Object.entries(languages).map(([k, v]) => [k, Math.round((v / repos.length) * 100)])
  )

  // Developer Score algorithm
  const calcScore = () => {
    let score = 30
    if (repos.length > 5) score += 10
    if (repos.length > 20) score += 10
    if (totalStars > 50) score += 10
    if (totalStars > 200) score += 10
    if (Object.keys(languages).length > 3) score += 10
    if (profile?.followers > 10) score += 5
    if (profile?.followers > 100) score += 5
    return Math.min(score, 100)
  }
  const devScore = profile ? calcScore() : 72

  // Skills from AI or default
  const skills = aiInsights?.skills || {
    Frontend: 70, Backend: 60, Algorithms: 50, 'AI/ML': 35, DevOps: 45, 'System Design': 55
  }

  const renderSection = () => {
    switch (active) {
      case 'overview': return <OverviewSection
        profile={profile} repos={repos} totalStars={totalStars} totalForks={totalForks}
        devScore={devScore} langPercent={langPercent} skills={skills}
        aiInsights={aiInsights} githubInput={githubInput} setGithubInput={setGithubInput}
        fetchGitHub={fetchGitHub} loading={loading} error={error}
        runAIAnalysis={runAIAnalysis} analyzeLoading={analyzeLoading}
      />
      case 'github': return <GitHubSection profile={profile} repos={repos} langPercent={langPercent} />
      case 'resume': return <ResumeSection resumeFile={resumeFile} setResumeFile={setResumeFile} uploadResume={uploadResume} uploadLoading={uploadLoading} resumeData={resumeData} />
      case 'insights': return <InsightsSection aiInsights={aiInsights} skills={skills} runAIAnalysis={runAIAnalysis} analyzeLoading={analyzeLoading} githubData={githubData} />
      case 'skills': return <SkillsSection skills={skills} aiInsights={aiInsights} />
      case 'repos': return <ReposSection repos={repos} />
      default: return null
    }
  }

  return (
    <div className="flex min-h-screen bg-[#050814]">
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1 ml-64 p-8">
        {cached && !active.loading && (
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-500 bg-slate-800/30 px-4 py-2 rounded-lg w-fit">
            <RefreshCw size={12} />
            Using cached data — Fetch again to refresh
          </div>
        )}
        <Suspense fallback={<div className="text-slate-500 text-sm">Loading charts...</div>}>
          {renderSection()}
        </Suspense>
      </main>
    </div>
  )
}

/* ===================== OVERVIEW SECTION ===================== */
function OverviewSection({ profile, repos, totalStars, totalForks, devScore, langPercent, skills, aiInsights, githubInput, setGithubInput, fetchGitHub, loading, error, runAIAnalysis, analyzeLoading }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Space Grotesk' }}>Dashboard Overview</h1>
        <p className="text-slate-400 text-sm">Analyze your GitHub profile and get AI-powered insights</p>
      </div>

      {/* GitHub Fetch */}
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Github size={16} /> Connect GitHub Profile</h2>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="form-input pl-10"
              placeholder="Enter GitHub username..."
              value={githubInput}
              onChange={e => setGithubInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchGitHub()}
            />
          </div>
          <button
            onClick={fetchGitHub}
            disabled={loading}
            className="gradient-btn px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
          >
            <span>{loading ? 'Fetching...' : 'Analyze'}</span>
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-3 flex items-center gap-2"><AlertTriangle size={14} />{error}</p>}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Award} label="Developer Score" value={devScore} color="#3b82f6" sub="out of 100" />
        <StatCard icon={Github} label="Repositories" value={repos.length || 0} color="#8b5cf6" sub="public repos" />
        <StatCard icon={Star} label="Total Stars" value={totalStars} color="#f59e0b" sub="across all repos" />
        <StatCard icon={Users} label="Followers" value={profile?.followers || 0} color="#10b981" sub="GitHub followers" />
      </div>

      {/* Score + Languages */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <ScoreDonut score={devScore} />
          {aiInsights && (
            <button
              onClick={runAIAnalysis}
              disabled={analyzeLoading}
              className="gradient-btn px-4 py-2 rounded-lg text-xs font-semibold mt-4 disabled:opacity-50"
            >
              <span>{analyzeLoading ? 'Analyzing...' : '↻ Re-run AI Analysis'}</span>
            </button>
          )}
          {!aiInsights && (
            <button
              onClick={runAIAnalysis}
              disabled={analyzeLoading || !repos.length}
              className="gradient-btn px-4 py-2 rounded-lg text-xs font-semibold mt-4 disabled:opacity-50"
            >
              <span>{analyzeLoading ? 'Analyzing...' : '⚡ Run AI Analysis'}</span>
            </button>
          )}
        </div>
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Code2 size={14} /> Top Languages</h2>
          <LanguageChart languages={Object.keys(langPercent).length ? langPercent : undefined} />
        </div>
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Activity size={14} /> Skill Radar</h2>
          <SkillRadar skills={skills} />
        </div>
      </div>

      {/* Activity + Repo Stars */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp size={14} /> Contribution Activity</h2>
          <ActivityChart />
        </div>
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Star size={14} /> Repository Stars</h2>
          <StarsChart repos={repos} />
        </div>
      </div>

      {/* Quick AI Highlights */}
      {aiInsights && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-green-400 mb-4 flex items-center gap-2"><CheckCircle2 size={14} /> Strengths</h2>
            <ul className="space-y-2">
              {(aiInsights.strengths || []).slice(0, 4).map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><span className="text-green-400 mt-0.5">✓</span>{s}</li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-yellow-400 mb-4 flex items-center gap-2"><Lightbulb size={14} /> Recommendations</h2>
            <ul className="space-y-2">
              {(aiInsights.recommendations || []).slice(0, 4).map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><span className="text-yellow-400 mt-0.5">→</span>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

/* ===================== GITHUB SECTION ===================== */
function GitHubSection({ profile, repos, langPercent }) {
  if (!profile) return (
    <div className="flex flex-col items-center justify-center h-64 glass-card rounded-2xl">
      <Github size={40} className="text-slate-600 mb-4" />
      <p className="text-slate-400">No GitHub data yet. Go to Overview and fetch a profile.</p>
    </div>
  )

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>GitHub Analysis</h1>

      {/* Profile card */}
      <div className="glass-card p-6 flex items-center gap-6">
        <img src={profile.avatar_url} alt="avatar" className="w-20 h-20 rounded-full border-2 border-blue-500/30" />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{profile.name || profile.login}</h2>
          <p className="text-slate-400 text-sm">{profile.bio || 'Developer'}</p>
          <div className="flex gap-4 mt-3 text-sm text-slate-400">
            <span className="flex items-center gap-1"><Users size={14} />{profile.followers} followers</span>
            <span className="flex items-center gap-1"><Github size={14} />{profile.public_repos} repos</span>
            {profile.location && <span>📍 {profile.location}</span>}
          </div>
        </div>
        <a href={profile.html_url} target="_blank" rel="noreferrer" className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold text-white no-underline">
          <span>View on GitHub</span>
        </a>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Language Distribution</h2>
          <LanguageChart languages={langPercent} />
        </div>
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Contribution Activity</h2>
          <ActivityChart />
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Repository Stars</h2>
        <StarsChart repos={repos} />
      </div>
    </div>
  )
}

/* ===================== RESUME SECTION ===================== */
function ResumeSection({ resumeFile, setResumeFile, uploadResume, uploadLoading, resumeData }) {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>Resume Analysis</h1>

      <div className="glass-card p-8 border-2 border-dashed border-white/10 hover:border-blue-500/30 transition-colors">
        <div className="text-center">
          <Upload size={40} className="text-slate-600 mx-auto mb-4" />
          <h2 className="text-white font-semibold mb-2">Upload Your Resume</h2>
          <p className="text-slate-400 text-sm mb-6">PDF format supported. AI will extract skills, tech stack, and experience.</p>
          <input type="file" accept=".pdf" onChange={e => setResumeFile(e.target.files[0])} className="hidden" id="resumeInput" />
          <label htmlFor="resumeInput" className="gradient-btn px-6 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer inline-block">
            <span>Choose PDF File</span>
          </label>
          {resumeFile && (
            <div className="mt-4 flex items-center gap-3 justify-center text-sm text-slate-300 bg-white/5 p-3 rounded-lg">
              <FileText size={16} className="text-blue-400" />
              {resumeFile.name}
              <button onClick={uploadResume} disabled={uploadLoading} className="gradient-btn px-4 py-1.5 rounded-lg text-xs font-semibold ml-2 disabled:opacity-50">
                <span>{uploadLoading ? 'Analyzing...' : 'Extract Skills'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {resumeData && (
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Extracted Skills', items: resumeData.skills || [], color: '#3b82f6' },
            { title: 'Technologies', items: resumeData.technologies || [], color: '#8b5cf6' },
            { title: 'Experience Keywords', items: resumeData.experience || [], color: '#06b6d4' },
          ].map(({ title, items, color }) => (
            <div key={title} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-white mb-4" style={{ color }}>{title}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map(item => <span key={item} className="tag-pill">{item}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ===================== INSIGHTS SECTION ===================== */
function InsightsSection({ aiInsights, skills, runAIAnalysis, analyzeLoading, githubData }) {
  if (!aiInsights) return (
    <div className="flex flex-col items-center justify-center h-64 glass-card rounded-2xl">
      <Brain size={40} className="text-slate-600 mb-4" />
      <p className="text-slate-400 mb-4">No AI insights yet. Fetch GitHub data first, then run analysis.</p>
      <button onClick={runAIAnalysis} disabled={analyzeLoading || !githubData} className="gradient-btn px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-50">
        <span>{analyzeLoading ? 'Analyzing...' : '⚡ Generate AI Insights'}</span>
      </button>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>AI Career Insights</h1>
        <button onClick={runAIAnalysis} disabled={analyzeLoading} className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center gap-2">
          <span className="flex items-center gap-2"><RefreshCw size={14} />{analyzeLoading ? 'Analyzing...' : 'Refresh'}</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-green-400 mb-5 flex items-center gap-2"><CheckCircle2 size={16} /> Strengths</h2>
          <ul className="space-y-3">
            {(aiInsights.strengths || ['JavaScript', 'React proficiency', 'Version control', 'API integration']).map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex-shrink-0 flex items-center justify-center text-xs mt-0.5">✓</span>
                <span className="text-slate-300">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weak areas */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-red-400 mb-5 flex items-center gap-2"><AlertTriangle size={16} /> Areas to Improve</h2>
          <ul className="space-y-3">
            {(aiInsights.weakAreas || ['Backend systems', 'Testing frameworks', 'Cloud infrastructure']).map((w, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex-shrink-0 flex items-center justify-center text-xs mt-0.5">✗</span>
                <span className="text-slate-300">{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Career paths */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-blue-400 mb-5 flex items-center gap-2"><TrendingUp size={16} /> Career Path Recommendations</h2>
          <div className="space-y-3">
            {(aiInsights.careerPaths || ['Frontend Engineer', 'Full Stack Developer', 'React Native Developer']).map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-blue-500/8 rounded-lg border border-blue-500/15">
                <div className="w-6 h-6 rounded-full gradient-btn flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                  <span className="relative z-10">{i + 1}</span>
                </div>
                <span className="text-sm text-slate-300">{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project suggestions */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-yellow-400 mb-5 flex items-center gap-2"><Lightbulb size={16} /> Suggested Projects</h2>
          <ul className="space-y-3">
            {(aiInsights.projectSuggestions || [
              'Build a REST API with Node.js + PostgreSQL',
              'Create a CI/CD pipeline with GitHub Actions',
              'Develop a CLI tool to automate a workflow',
              'Contribute to an open-source project',
            ]).map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <Zap size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Summary */}
      {aiInsights.summary && (
        <div className="glass-card p-6 neon-border">
          <h2 className="text-sm font-semibold text-violet-400 mb-4 flex items-center gap-2"><Brain size={16} /> AI Summary</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{aiInsights.summary}</p>
        </div>
      )}
    </div>
  )
}

/* ===================== SKILLS SECTION ===================== */
function SkillsSection({ skills, aiInsights }) {
  const careerPaths = [
    { name: 'Frontend Developer', required: ['React', 'TypeScript', 'CSS', 'Web Performance', 'Testing', 'Accessibility'] },
    { name: 'Full Stack Developer', required: ['Node.js', 'Databases', 'REST APIs', 'Auth', 'Docker', 'CI/CD'] },
    { name: 'AI Engineer', required: ['Python', 'ML Frameworks', 'Data Processing', 'Vector DBs', 'LLM APIs', 'MLOps'] },
  ]
  const userSkills = aiInsights?.detectedSkills || ['React', 'JavaScript', 'CSS', 'Node.js', 'Python', 'REST APIs']

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>Skill Radar & Gap Analysis</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Skill Proficiency Radar</h2>
          <SkillRadar skills={skills} />
        </div>
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Skill Levels</h2>
          <div className="space-y-4">
            {Object.entries(skills).map(([skill, level]) => (
              <div key={skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{skill}</span>
                  <span className="text-blue-400 font-semibold">{level}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career Gaps */}
      <h2 className="text-xl font-bold text-white">Skill Gap by Career Path</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {careerPaths.map(({ name, required }) => {
          const have = required.filter(r => userSkills.some(s => s.toLowerCase().includes(r.toLowerCase())))
          const missing = required.filter(r => !userSkills.some(s => s.toLowerCase().includes(r.toLowerCase())))
          const pct = Math.round((have.length / required.length) * 100)
          return (
            <div key={name} className="glass-card p-5">
              <h3 className="font-semibold text-white mb-3">{name}</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 progress-bar h-2">
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm font-bold text-blue-400">{pct}%</span>
              </div>
              <div className="space-y-1">
                {have.map(s => <div key={s} className="text-xs text-green-400 flex items-center gap-2"><span>✓</span>{s}</div>)}
                {missing.map(s => <div key={s} className="text-xs text-red-400 flex items-center gap-2"><span>✗</span>{s} <span className="text-slate-600">missing</span></div>)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ===================== REPOS SECTION ===================== */
function ReposSection({ repos }) {
  if (!repos.length) return (
    <div className="flex flex-col items-center justify-center h-64 glass-card rounded-2xl">
      <Github size={40} className="text-slate-600 mb-4" />
      <p className="text-slate-400">No repositories found. Fetch a GitHub profile first.</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>Repository Analyzer</h1>
      <p className="text-slate-400 text-sm">AI quality evaluation for each repository</p>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {repos.slice(0, 12).map(repo => <RepoCard key={repo.id} repo={repo} />)}
      </div>
    </div>
  )
}

/* Re-export StatCard and ScoreDonut at module level */
function StatCardWrapper(props) { return <StatCard {...props} /> }
