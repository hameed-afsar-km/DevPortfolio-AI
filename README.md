# 🚀 DevPortfolio AI | AI-Powered Developer Identity Lab 🖤

![DevPortfolio Banner](https://img.shields.io/badge/DevPortfolio-AI-blueviolet?style=for-the-badge&logo=google-gemini&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**DevPortfolio AI** is a professional SaaS platform designed to transform raw developer data into a compelling professional narrative. By analyzing GitHub profiles and PDF resumes, it generates deep technical metrics, AI career guidance, and a live-hosted portfolio in seconds.

---

## ⚡ Key Features

- **📊 Intelligent Analytics**: Deep-dive into language distribution, commit patterns, and project impact.
- **🤖 Gemini AI Insights**: Personalized career pathing, skill gap analysis, and repository quality scoring.
- **📄 Resume Intelligence**: Automated extraction of tech stacks and experience from PDF uploads.
- **✨ Portfolio Engine**: One-click generation of a cinematic, responsive developer portfolio.
- **👔 Recruiter Mode**: A dedicated portal for recruiters to instantly evaluate candidate technical depth.

---

## 📂 Project Structure

```text
devportfolio-ai/
├── client/                # React + Vite Frontend
│   ├── src/
│   │   ├── charts/        # Custom Chart.js implementations
│   │   ├── components/    # Reusable UI (Glassmorphic)
│   │   ├── hooks/         # Auth & Data logic
│   │   ├── pages/         # Dashboard, Portfolio, RecruiterMode
│   │   └── services/      # Axios API wrappers
│   └── index.css          # Tailwind config & SaaS design tokens
├── server/                # Node.js + Express Backend
│   ├── controllers/       # Business logic (AI, GitHub, Resume)
│   ├── models/            # Mongoose Schemas (User, Dashboard)
│   ├── routes/            # API Endpoints
│   ├── utils/             # JWT & Auth Middleware
│   └── server.js          # Entry point
└── package.json           # Root orchestration
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js**: v18+
- **MongoDB**: Local instance or Atlas URI
- **API Keys**: Google Gemini (Optional for AI features)

### steps
1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Configuration**:
   Create `server/.env` and add:
   ```env
   MONGODB_URI=your_mongo_uri
   JWT_SECRET=your_secret
   GEMINI_API_KEY=your_key
   GITHUB_TOKEN=your_token
   ```

3. **Run Dev Mode**:
   Launch both client and server simultaneously:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

---

## 💡 Technical Highlights

- **Regex-Based PDF Parser**: Custom extraction logic for identifying 50+ tech keywords from unstructured resumes.
- **In-Memory Caching**: 10-minute TTL cache for GitHub API calls to prevent rate-limiting.
- **Dynamic Score Algorithm**: Normalizes stars, repositories, and language diversity into a single "Dev Score".

---

## 📄 License
MIT © 2026 DevPortfolio AI
