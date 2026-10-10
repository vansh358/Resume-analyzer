const router = require('express').Router();
const Application = require('../models/Application');

router.get('/', async (_req, res, next) => {
  try { res.json(await Application.find().sort('-updatedAt')); } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try { res.status(201).json(await Application.create(req.body)); } catch (e) { next(e); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const doc = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
});

module.exports = router;
