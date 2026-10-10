import { useState } from 'react';
import MatchForm from './components/MatchForm';
import KanbanBoard from './components/KanbanBoard';

export default function App() {
  const [tab, setTab] = useState('match');
  return (
    <div className="container">
      <header>
        <h1>📄 Resume Matcher</h1>
        <nav>
          <button className={tab === 'match' ? 'active' : ''} onClick={() => setTab('match')}>Matcher</button>
          <button className={tab === 'board' ? 'active' : ''} onClick={() => setTab('board')}>Applications</button>
        </nav>
      </header>
      {/* Matcher stays mounted so results survive tab switches */}
      <div hidden={tab !== 'match'}><MatchForm /></div>
      {tab === 'board' && <KanbanBoard />}
    </div>
  );
}
