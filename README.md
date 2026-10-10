# Resume ↔ JD Matcher (MERN + Google Gemini)

Upload a resume (PDF/TXT) + paste a job description → match score, missing keywords, rewritten bullets. Track applications on a Kanban board.

## Run
```bash
# 1. Backend
cd server && cp .env.example .env   # add GEMINI_API_KEY + MONGO_URI (free key: aistudio.google.com)
npm install && npm run dev          # http://localhost:5000

# 2. Frontend
cd client && npm install && npm run dev   # http://localhost:5173
```

## Structure
```
resume-matcher/
├── server/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── index.js                 # app entry
│       ├── config/db.js             # mongoose connection
│       ├── middleware/{upload,error}.js
│       ├── models/{Analysis,Application}.js
│       ├── routes/{analysis,applications}.js
│       └── services/{ai (Gemini),resumeParser}.js
└── client/
    ├── package.json, vite.config.js, index.html
    └── src/
        ├── main.jsx, App.jsx, api.js, index.css
        └── components/{MatchForm,ResultCard,KanbanBoard}.jsx
```

## Ideas to extend
JWT auth (per-user data), DOCX parsing (mammoth), rate limiting, streaming AI output, export improved resume as PDF.
