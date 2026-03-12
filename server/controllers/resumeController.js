const fs = require('fs')
const path = require('path')

const upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const filePath = req.file.path

    // Try to parse PDF
    let text = ''
    try {
      const pdfParse = require('pdf-parse')
      const pdfBuffer = fs.readFileSync(filePath)
      const parsed = await pdfParse(pdfBuffer)
      text = parsed.text
    } catch (parseErr) {
      text = 'PDF parsing failed — using filename: ' + req.file.originalname
    } finally {
      // Clean up uploaded file
      try { fs.unlinkSync(filePath) } catch {}
    }

    // Extract skills from text
    const extracted = extractFromText(text)
    res.json(extracted)
  } catch (err) {
    console.error('Resume upload error:', err)
    res.status(500).json({ message: 'Resume processing failed' })
  }
}

function extractFromText(text) {
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
    'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Firebase', 'Supabase',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Vercel', 'Heroku', 'CI/CD',
    'Git', 'GitHub', 'REST API', 'GraphQL', 'WebSocket', 'gRPC',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP',
    'CSS', 'Tailwind', 'SASS', 'Bootstrap', 'Material UI',
  ]

  const techKeywords = skillKeywords.slice(0, 20)

  const experiencePatterns = [
    /(\d+)\+?\s*years?\s*(?:of\s*)?experience/gi,
    /senior|lead|staff|principal|junior|mid-level/gi,
    /full.?stack|frontend|backend|devops|ml engineer|data scientist/gi,
  ]

  const foundSkills = skillKeywords.filter(s =>
    new RegExp(s.replace('+', '\\+'), 'i').test(text)
  )

  const foundTech = foundSkills.slice(0, 12)

  const experience = []
  experiencePatterns.forEach(pattern => {
    const matches = text.match(pattern) || []
    experience.push(...matches.map(m => m.trim()))
  })

  return {
    skills: [...new Set(foundSkills)].slice(0, 15),
    technologies: [...new Set(foundTech)].slice(0, 10),
    experience: [...new Set(experience)].slice(0, 8),
    rawText: text.substring(0, 500) + (text.length > 500 ? '...' : ''),
  }
}

module.exports = { upload }
