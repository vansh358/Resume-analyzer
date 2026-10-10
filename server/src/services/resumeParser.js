const pdf = require('pdf-parse');

module.exports = async function extractResumeText(file) {
  let text = '';
  if (file.mimetype === 'application/pdf') {
    text = (await pdf(file.buffer)).text;
  } else {
    text = file.buffer.toString('utf-8');
  }
  text = text.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (text.length < 50) {
    const e = new Error('Could not read enough text from the resume (scanned PDF?)');
    e.status = 422;
    throw e;
  }
  return text;
};
