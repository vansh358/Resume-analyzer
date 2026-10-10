exports.notFound = (req, res) => res.status(404).json({ error: `Not found: ${req.originalUrl}` });

exports.errorHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
};
