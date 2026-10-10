import { useState } from 'react';
import { createApplication, errMsg } from '../api';

const scoreColor = (s) => (s >= 75 ? '#16a34a' : s >= 50 ? '#d97706' : '#dc2626');

export default function ResultCard({ result }) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const saveToBoard = async () => {
    try {
      await createApplication({
        company: result.company || 'Unknown company',
        role: result.jobTitle || 'Unknown role',
        matchScore: result.score,
        jdText: result.jdText,
        analysis: result._id,
      });
      setSaved(true);
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div className="card">
      <div className="score" style={{ borderColor: scoreColor(result.score), color: scoreColor(result.score) }}>
        {result.score}<small>/100</small>
      </div>
      <p>{result.summary}</p>

      <h3>✅ Matched keywords</h3>
      <div className="chips">{result.matchedKeywords.map((k) => <span key={k} className="chip ok">{k}</span>)}</div>

      <h3>⚠️ Missing keywords</h3>
      <div className="chips">{result.missingKeywords.map((k) => <span key={k} className="chip bad">{k}</span>)}</div>

      <h3>✨ Improved bullet points</h3>
      {result.improvedBullets.map((b, i) => (
        <div key={i} className="bullet">
          <p className="old">− {b.original}</p>
          <p className="new">+ {b.improved}</p>
          <p className="why">{b.reason}</p>
          <button onClick={() => navigator.clipboard.writeText(b.improved)}>Copy</button>
        </div>
      ))}

      {error && <p className="error">{error}</p>}
      <button className="primary" onClick={saveToBoard} disabled={saved}>
        {saved ? 'Saved to board ✓' : 'Save to application board'}
      </button>
    </div>
  );
}
