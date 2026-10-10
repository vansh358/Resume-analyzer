const multer = require('multer');

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ['application/pdf', 'text/plain'].includes(file.mimetype);
    cb(ok ? null : new Error('Only PDF or TXT resumes are supported'), ok);
  },
});
