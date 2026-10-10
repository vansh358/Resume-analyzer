const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema(
  {
    jobTitle: String,
    company: String,
    jdText: { type: String, required: true },
    resumeText: { type: String, required: true },
    score: { type: Number, min: 0, max: 100 },
    summary: String,
    matchedKeywords: [String],
    missingKeywords: [String],
    improvedBullets: [{ original: String, improved: String, reason: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analysis', AnalysisSchema);
