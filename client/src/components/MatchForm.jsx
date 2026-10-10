import { useState } from 'react';
import { analyze, errMsg } from '../api';
import ResultCard from './ResultCard';

export default function MatchForm() {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) return setError('Please upload your resume');
    const fd = new FormData();
    fd.append('resume', file);
    fd.append('jdText', jdText);
    fd.append('company', company);
    fd.append('jobTitle', jobTitle);
    setLoading(true);
    try {
      setResult(await analyze(fd));
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="card" onSubmit={submit}>
        <div className="row">
          <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
          <input placeholder="Job title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
        </div>
        <label className="file">
          <input type="file" accept=".pdf,.txt" onChange={(e) => setFile(e.target.files[0])} />
          {file ? file.name : 'Upload resume (PDF or TXT, max 5MB)'}
        </label>
        <textarea rows={10} placeholder="Paste the job description here…" value={jdText} onChange={(e) => setJdText(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button className="primary" disabled={loading}>{loading ? 'Analyzing…' : 'Analyze match'}</button>
      </form>
      {result && <ResultCard result={result} />}
    </>
  );
}
