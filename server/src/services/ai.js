require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const SYSTEM = `You are an expert technical recruiter and resume coach.
Compare a resume against a job description and respond with ONLY valid JSON in this exact shape:
{
  "score": <integer 0-100, honest overall fit>,
  "summary": "<2-3 sentence assessment>",
  "matchedKeywords": ["skills/terms present in BOTH"],
  "missingKeywords": ["important JD skills/terms absent from the resume"],
  "improvedBullets": [
    { "original": "<existing resume bullet>", "improved": "<rewrite tailored to the JD>", "reason": "<why>" }
  ]
}
Never invent experience or metrics the resume doesn't support. Return 3-6 improvedBullets and at most 15 keywords per list.`;

exports.analyzeMatch = async (resumeText, jdText) => {
const key = (process.env.GEMINI_API_KEY || '').trim();

if (!key) {
  const e = new Error('GEMINI_API_KEY is missing in server/.env');
  e.status = 500;
  throw e;
}

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM,
    generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
  });

  const result = await model.generateContent(
    `<resume>\n${resumeText.slice(0, 12000)}\n</resume>\n\n<job_description>\n${jdText.slice(0, 8000)}\n</job_description>`
  );

  const raw = result.response.text();
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('AI returned no JSON');
  const data = JSON.parse(raw.slice(start, end + 1));
  data.score = Math.max(0, Math.min(100, Math.round(Number(data.score) || 0)));
  data.matchedKeywords ||= [];
  data.missingKeywords ||= [];
  data.improvedBullets ||= [];
  return data;
};
