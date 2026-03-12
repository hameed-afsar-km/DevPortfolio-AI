const { GoogleGenerativeAI } = require('@google/generative-ai')

// Fallback mock insights if no API key
const mockInsights = (data) => {
  const repos = data.githubData?.repos || []
  const profile = data.githubData?.profile || {}
  const skills = data.resumeData?.skills || []

  const languages = repos.reduce((acc, r) => {
    if (r.language) acc[r.language] = (acc[r.language] || 0) + 1
    return acc
  }, {})
  const topLangs = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([l]) => l)

  return {
    strengths: [
      ...topLangs.map(l => `Proficient in ${l}`),
      repos.length > 10 ? 'Active contributor with many public projects' : 'Growing project portfolio',
      profile.followers > 50 ? 'Strong community presence' : 'Building community reputation',
    ].slice(0, 5),
    weakAreas: [
      !languages['Python'] ? 'Python / Data Science skills' : null,
      !languages['Go'] && !languages['Rust'] ? 'Systems programming languages' : null,
      repos.length < 5 ? 'Need more public projects' : null,
      'Testing and TDD practices',
      'Cloud infrastructure (AWS/GCP)',
    ].filter(Boolean).slice(0, 4),
    recommendations: [
      'Build a full-stack project with authentication and deploy it',
      'Contribute to an open-source project in your primary language',
      'Learn Docker and containerization for deployment',
      'Add comprehensive README files to all repositories',
      'Set up CI/CD pipelines using GitHub Actions',
    ],
    careerPaths: ['Frontend Engineer', 'Full Stack Developer', 'JavaScript Specialist', 'Open Source Contributor'],
    projectSuggestions: [
      'Build a REST API with Node.js + PostgreSQL with full auth',
      'Create a CLI tool that automates a developer workflow',
      'Develop a Chrome extension for productivity',
      'Build a real-time app with WebSockets',
    ],
    skills: {
      Frontend: Math.min(30 + (languages['JavaScript'] || 0) * 8 + (languages['TypeScript'] || 0) * 10, 95),
      Backend: Math.min(20 + (languages['Node.js'] || 0) * 12 + (languages['Python'] || 0) * 8, 90),
      Algorithms: 45 + Math.floor(repos.length / 3),
      'AI/ML': Math.min(20 + (languages['Python'] || 0) * 15, 85),
      DevOps: 35,
      'System Design': 40,
    },
    detectedSkills: [...topLangs, ...skills.slice(0, 5)],
    summary: `${profile.name || data.username || 'This developer'} shows strong expertise in ${topLangs.slice(0, 3).join(', ')} with ${repos.length} public repositories. The profile indicates an active developer who would benefit from expanding into cloud infrastructure and testing practices. Overall solid technical foundation with good potential for growth.`,
  }
}

const analyze = async (req, res) => {
  try {
    const { githubData, resumeData, username } = req.body

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey || apiKey === '' || apiKey === 'your_gemini_api_key') {
      // Return mock insights
      const insights = mockInsights({ githubData, resumeData, username })
      return res.json({ ...insights, source: 'mock' })
    }

    // Use Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const profile = githubData?.profile || {}
    const repos = githubData?.repos || []
    const resumeSkills = resumeData?.skills || []

    const languages = repos.reduce((acc, r) => {
      if (r.language) acc[r.language] = (acc[r.language] || 0) + 1
      return acc
    }, {})
    const totalStars = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0)

    const prompt = `You are an expert developer career coach. Analyze this developer's profile and provide detailed JSON insights.

Developer Profile:
- Name: ${profile.name || username || 'Unknown'}
- GitHub Bio: ${profile.bio || 'Not provided'}
- Public Repos: ${repos.length}
- Total Stars: ${totalStars}
- Followers: ${profile.followers || 0}
- Top Languages: ${JSON.stringify(languages)}
- Resume Skills: ${resumeSkills.join(', ') || 'Not uploaded'}
- Top Repos: ${repos.slice(0, 5).map(r => r.name + (r.description ? ': ' + r.description : '')).join('\n')}

Respond with ONLY valid JSON in this exact structure:
{
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4", "strength 5"],
  "weakAreas": ["area 1", "area 2", "area 3"],
  "recommendations": ["rec 1", "rec 2", "rec 3", "rec 4"],
  "careerPaths": ["path 1", "path 2", "path 3"],
  "projectSuggestions": ["project 1", "project 2", "project 3", "project 4"],
  "skills": {
    "Frontend": <0-100>,
    "Backend": <0-100>,
    "Algorithms": <0-100>,
    "AI/ML": <0-100>,
    "DevOps": <0-100>,
    "System Design": <0-100>
  },
  "detectedSkills": ["skill1", "skill2", "skill3"],
  "summary": "2-3 sentence professional summary of this developer"
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response format')
    
    const parsed = JSON.parse(jsonMatch[0])
    res.json({ ...parsed, source: 'gemini' })

  } catch (err) {
    console.error('AI analyze error:', err.message)
    // Fallback to mock
    const insights = mockInsights(req.body)
    res.json({ ...insights, source: 'mock', error: err.message })
  }
}

const generatePortfolio = async (req, res) => {
  try {
    const { profile, repos, skills } = req.body
    // Placeholder — Frontend handles portfolio generation
    res.json({ success: true, message: 'Portfolio data received', profile, skills })
  } catch (err) {
    res.status(500).json({ message: 'Portfolio generation failed' })
  }
}

module.exports = { analyze, generatePortfolio }
