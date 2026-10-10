import { useEffect, useState } from 'react';
import { getApplications, createApplication, updateApplication, deleteApplication } from '../api';

const COLUMNS = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function KanbanBoard() {
  const [apps, setApps] = useState([]);
  const [dragId, setDragId] = useState(null);
  const [form, setForm] = useState({ company: '', role: '' });

  useEffect(() => { getApplications().then(setApps); }, []);

  const move = async (id, status) => {
    setApps((a) => a.map((x) => (x._id === id ? { ...x, status } : x))); // optimistic
    try { await updateApplication(id, { status }); }
    catch { getApplications().then(setApps); }
  };

  const add = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) return;
    const created = await createApplication(form);
    setApps((a) => [created, ...a]);
    setForm({ company: '', role: '' });
  };

  const remove = async (id) => {
    setApps((a) => a.filter((x) => x._id !== id));
    await deleteApplication(id);
  };

  return (
    <>
      <form className="row add" onSubmit={add}>
        <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        <input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        <button className="primary">+ Add</button>
      </form>

      <div className="board">
        {COLUMNS.map((col) => (
          <div
            key={col}
            className="column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => dragId && move(dragId, col)}
          >
            <h4>{col} <span>{apps.filter((a) => a.status === col).length}</span></h4>
            {apps.filter((a) => a.status === col).map((a) => (
              <div key={a._id} className="kcard" draggable onDragStart={() => setDragId(a._id)} onDragEnd={() => setDragId(null)}>
                <strong>{a.company}</strong>
                <div>{a.role}</div>
                {a.matchScore != null && <span className="chip ok">Match {a.matchScore}%</span>}
                <button className="x" onClick={() => remove(a._id)}>×</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
