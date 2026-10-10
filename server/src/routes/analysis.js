const router = require('express').Router();
const upload = require('../middleware/upload');
const extractResumeText = require('../services/resumeParser');
const { analyzeMatch } = require('../services/ai');
const Analysis = require('../models/Analysis');

// POST /api/analysis  (multipart: resume file, jdText, jobTitle?, company?)
router.post('/', upload.single('resume'), async (req, res, next) => {
  try {
    const { jdText, jobTitle, company } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Resume file is required' });
    if (!jdText || jdText.trim().length < 30)
      return res.status(400).json({ error: 'Please paste a job description' });

    const resumeText = await extractResumeText(req.file);
    const result = await analyzeMatch(resumeText, jdText);
    const saved = await Analysis.create({ jobTitle, company, jdText, resumeText, ...result });
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

// GET /api/analysis  (history, lightweight)
router.get('/', async (_req, res, next) => {
  try {
    res.json(await Analysis.find().select('-resumeText -jdText').sort('-createdAt').limit(50));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const doc = await Analysis.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    console.log('GET /api/analysis/:id', req.params.id, 'found', doc._id);
    res.json(doc);
  } catch (err) { next(err); }
});

module.exports = router;
