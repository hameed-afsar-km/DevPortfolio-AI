import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  Zap, Github, Brain, BarChart2, FileText, Globe, Star,
  ArrowRight, ChevronRight, Code2, TrendingUp, Award, Users
} from 'lucide-react'

const features = [
  { icon: Github, title: 'GitHub Analysis', desc: 'Deep analysis of your repositories, languages, stars, and contribution patterns.', color: '#3b82f6' },
  { icon: Brain, title: 'AI Career Insights', desc: 'GPT-powered analysis of your strengths, skill gaps, and career recommendations.', color: '#8b5cf6' },
  { icon: BarChart2, title: 'Developer Score', desc: 'Quantified developer score based on activity, diversity, and project quality.', color: '#06b6d4' },
  { icon: FileText, title: 'Resume Analysis', desc: 'Upload your resume and extract skills, experience, and tech stack automatically.', color: '#10b981' },
  { icon: Globe, title: 'Portfolio Generator', desc: 'Instantly generate a stunning portfolio website from your GitHub + resume data.', color: '#f59e0b' },
  { icon: Code2, title: 'Repo Evaluator', desc: 'AI reviews each repo for code quality, documentation, and innovation score.', color: '#ec4899' },
]

const stats = [
  { value: '10K+', label: 'Developers Analyzed', icon: Users },
  { value: '98%', label: 'Accuracy Rate', icon: Award },
  { value: '500+', label: 'Portfolios Generated', icon: Globe },
  { value: '4.9★', label: 'User Rating', icon: Star },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050814] grid-bg">
      <Navbar transparent />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-4000" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 animate-fade-in-up">
          <Zap size={14} className="text-yellow-400" />
          AI-Powered Developer Intelligence Platform
          <Zap size={14} className="text-yellow-400" />
        </div>

        <h1
          className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-fade-in-up animate-delay-100"
          style={{ fontFamily: 'Space Grotesk' }}
        >
          Your GitHub Profile,
          <br />
          <span className="gradient-text">Supercharged with AI</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed animate-fade-in-up animate-delay-200">
          DevPortfolio AI analyzes your GitHub, resume, and skills to generate
          deep developer analytics, AI career insights, and a stunning portfolio website.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-300">
          <Link
            to="/register"
            className="gradient-btn px-8 py-4 rounded-xl font-semibold text-white no-underline flex items-center gap-2 text-base"
          >
            <span className="flex items-center gap-2">
              <Zap size={18} />
              Analyze My Profile
              <ArrowRight size={16} />
            </span>
          </Link>
          <Link
            to="/recruiter"
            className="px-8 py-4 rounded-xl font-semibold text-slate-300 no-underline flex items-center gap-2 border border-white/10 hover:border-blue-500/40 hover:text-white transition-all text-base"
          >
            <Users size={18} />
            Recruiter Mode
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Animated Dashboard Preview */}
        <div className="mt-20 w-full max-w-5xl animate-fade-in-up animate-delay-300">
          <div className="glass-card p-1 rounded-2xl glow-blue">
            <div className="bg-[#0a0f1e] rounded-xl p-6">
              {/* Mini Dashboard Preview */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Dev Score', val: '87', color: '#3b82f6' },
                  { label: 'Repos', val: '34', color: '#8b5cf6' },
                  { label: 'Total Stars', val: '1.2K', color: '#06b6d4' },
                  { label: 'Languages', val: '8', color: '#10b981' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="glass-card p-4 text-center">
                    <div className="text-2xl font-bold mb-1" style={{ color }}>{val}</div>
                    <div className="text-xs text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 glass-card p-4 h-32 flex items-end gap-2">
                  {[65, 40, 80, 55, 90, 70, 85, 60, 95, 75, 88, 72].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `rgba(59,130,246,${0.3 + h/200})` }} />
                  ))}
                </div>
                <div className="glass-card p-4 flex flex-col gap-3">
                  {['JavaScript', 'TypeScript', 'Python', 'CSS'].map((lang, i) => (
                    <div key={lang}>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{lang}</span><span>{[40,25,20,15][i]}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${[40,25,20,15][i]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="glass-card p-6 text-center stat-card">
              <Icon size={24} className="text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-black gradient-text mb-1" style={{ fontFamily: 'Space Grotesk' }}>{value}</div>
              <div className="text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium mb-4">
              <Brain size={14} /> Everything You Need
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              Built for <span className="gradient-text">Serious Developers</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From GitHub analysis to AI-powered career insights — all in one unified platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass-card p-6 group">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths Section */}
      <section className="py-20 px-6 bg-[#070d1a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4" style={{ fontFamily: 'Space Grotesk' }}>
              Detect Your <span className="gradient-text">Skill Gaps</span>
            </h2>
            <p className="text-slate-400">See exactly what skills you're missing for your dream career path</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { path: 'Frontend Developer', skills: ['React', 'TypeScript', 'CSS', 'Testing'], missing: ['Web Performance', 'A11y'], color: '#3b82f6' },
              { path: 'Full Stack Developer', skills: ['Node.js', 'Databases', 'APIs', 'Auth'], missing: ['Microservices', 'Docker'], color: '#8b5cf6' },
              { path: 'AI Engineer', skills: ['Python', 'ML Basics', 'APIs'], missing: ['Deep Learning', 'MLOps', 'Vector DBs'], color: '#06b6d4' },
            ].map(({ path, skills, missing, color }) => (
              <div key={path} className="glass-card p-6">
                <div className="font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  {path}
                </div>
                <div className="space-y-2 mb-4">
                  {skills.map(s => (
                    <div key={s} className="flex items-center gap-2 text-sm text-green-400">
                      <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-xs">✓</div>
                      {s}
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/5 pt-3">
                  <p className="text-xs text-slate-500 mb-2">Missing Skills:</p>
                  {missing.map(s => (
                    <div key={s} className="flex items-center gap-2 text-sm text-red-400 mb-1">
                      <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-xs">✗</div>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ fontFamily: 'Space Grotesk' }}>
            Ready to level up your<br /><span className="gradient-text">dev career?</span>
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Join thousands of developers using AI to supercharge their profiles and get noticed.
          </p>
          <Link
            to="/register"
            className="gradient-btn px-10 py-4 rounded-xl font-bold text-white no-underline inline-flex items-center gap-3 text-base"
          >
            <span className="flex items-center gap-3">
              <Zap size={20} />
              Start Free Analysis
              <ArrowRight size={18} />
            </span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-btn flex items-center justify-center">
              <Zap size={12} className="relative z-10 text-white" />
            </div>
            <span className="font-bold text-sm gradient-text">DevPortfolio AI</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 DevPortfolio AI. Built for developers, by developers.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" className="text-slate-500 hover:text-slate-300 text-sm no-underline transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
