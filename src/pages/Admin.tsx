import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser, getEvent, setEvent as saveEvent,
  getChallenges, setChallenges as saveChallenges,
  getUsers, initStore
} from '@/lib/store';
import { GlitchText } from '@/components/GlitchText';
import type { Challenge, EventState } from '@/lib/types';

initStore();

const Admin = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [event, setEventState] = useState<EventState>(getEvent());
  const [challenges, setChallengesState] = useState<Challenge[]>(getChallenges());
  const [users] = useState(getUsers());
  const [tab, setTab] = useState<'event' | 'challenges' | 'users'>('event');

  // New challenge form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<Challenge['category']>('cryptography');
  const [newDifficulty, setNewDifficulty] = useState<Challenge['difficulty']>('easy');
  const [newPoints, setNewPoints] = useState(100);
  const [newFlag, setNewFlag] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/');
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const updateEvent = (updates: Partial<EventState>) => {
    const updated = { ...event, ...updates };
    setEventState(updated);
    saveEvent(updated);
  };

  const addChallenge = () => {
    if (!newTitle || !newFlag) return;
    const challenge: Challenge = {
      id: crypto.randomUUID(),
      title: newTitle,
      description: newDesc,
      category: newCategory,
      difficulty: newDifficulty,
      points: newPoints,
      flag: newFlag,
      solveCount: 0,
      enabled: true,
      hints: [],
    };
    const updated = [...challenges, challenge];
    setChallengesState(updated);
    saveChallenges(updated);
    setNewTitle(''); setNewDesc(''); setNewFlag('');
  };

  const toggleChallenge = (id: string) => {
    const updated = challenges.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c);
    setChallengesState(updated);
    saveChallenges(updated);
  };

  const deleteChallenge = (id: string) => {
    const updated = challenges.filter(c => c.id !== id);
    setChallengesState(updated);
    saveChallenges(updated);
  };

  return (
    <div className="noise-bg min-h-screen">
      <div className="crt-overlay" />
      <div className="container mx-auto px-4 py-10 space-y-8">
        <GlitchText as="h1" className="text-3xl text-primary text-center">// ADMIN CONSOLE</GlitchText>

        {/* Tabs */}
        <div className="flex gap-3 justify-center">
          {(['event', 'challenges', 'users'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`terminal-btn ${tab === t ? 'active' : ''}`}
            >
              [ {t} ]
            </button>
          ))}
        </div>

        {/* Event Control */}
        {tab === 'event' && (
          <div className="max-w-xl mx-auto border border-border p-6 space-y-4 bg-card/50">
            <h3 className="font-mono text-sm text-terminal-green">EVENT STATUS</h3>
            <div className="flex gap-3">
              {(['upcoming', 'live', 'ended'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => updateEvent({ status: s })}
                  className={`terminal-btn ${event.status === s ? 'active' : ''}`}
                >
                  [ {s} ]
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground">Start Time</label>
              <input
                type="datetime-local"
                value={event.startTime.slice(0, 16)}
                onChange={e => updateEvent({ startTime: new Date(e.target.value).toISOString() })}
                className="w-full bg-secondary border border-border p-2 font-mono text-sm text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-xs text-muted-foreground">End Time</label>
              <input
                type="datetime-local"
                value={event.endTime.slice(0, 16)}
                onChange={e => updateEvent({ endTime: new Date(e.target.value).toISOString() })}
                className="w-full bg-secondary border border-border p-2 font-mono text-sm text-foreground"
              />
            </div>
          </div>
        )}

        {/* Challenge Management */}
        {tab === 'challenges' && (
          <div className="space-y-6">
            {/* Add new */}
            <div className="max-w-xl mx-auto border border-border p-6 space-y-3 bg-card/50">
              <h3 className="font-mono text-sm text-terminal-green">ADD CHALLENGE</h3>
              <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Title" className="w-full bg-secondary border border-border p-2 font-mono text-sm text-foreground placeholder:text-muted-foreground" />
              <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description" rows={3} className="w-full bg-secondary border border-border p-2 font-mono text-sm text-foreground placeholder:text-muted-foreground resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={newCategory} onChange={e => setNewCategory(e.target.value as Challenge['category'])} className="bg-secondary border border-border p-2 font-mono text-sm text-foreground">
                  <option value="cryptography">Cryptography</option>
                  <option value="reverse-engineering">Reverse Engineering</option>
                  <option value="osint">OSINT</option>
                  <option value="steganography">Steganography</option>
                </select>
                <select value={newDifficulty} onChange={e => setNewDifficulty(e.target.value as Challenge['difficulty'])} className="bg-secondary border border-border p-2 font-mono text-sm text-foreground">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="insane">Insane</option>
                </select>
              </div>
              <input type="number" value={newPoints} onChange={e => setNewPoints(+e.target.value)} placeholder="Points" className="w-full bg-secondary border border-border p-2 font-mono text-sm text-foreground" />
              <input value={newFlag} onChange={e => setNewFlag(e.target.value)} placeholder="FLAG{...}" className="w-full bg-secondary border border-border p-2 font-mono text-sm text-foreground placeholder:text-muted-foreground" />
              <button onClick={addChallenge} className="w-full py-2 border border-terminal-green text-terminal-green font-mono text-sm hover:bg-terminal-green/10 transition-all">
                [ Add Challenge ]
              </button>
            </div>

            {/* List */}
            <div className="space-y-2">
              {challenges.map(c => (
                <div key={c.id} className="border border-border p-4 flex items-center justify-between bg-card/30">
                  <div>
                    <span className={`font-mono text-sm ${c.enabled ? 'text-foreground' : 'text-muted-foreground line-through'}`}>{c.title}</span>
                    <span className="font-mono text-xs text-muted-foreground ml-3">{c.points}pts • {c.category} • {c.difficulty}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleChallenge(c.id)} className={`terminal-btn text-xs ${c.enabled ? 'active' : ''}`}>
                      {c.enabled ? '[ on ]' : '[ off ]'}
                    </button>
                    <button onClick={() => deleteChallenge(c.id)} className="terminal-btn text-xs text-primary hover:border-primary">
                      [ del ]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="border border-border">
            <div className="grid grid-cols-4 gap-4 p-3 border-b border-border bg-card/50 font-mono text-xs text-muted-foreground uppercase">
              <span>Alias</span><span>Email</span><span>Role</span><span>Score</span>
            </div>
            {users.map(u => (
              <div key={u.id} className="grid grid-cols-4 gap-4 p-3 border-b border-border/50 font-mono text-sm">
                <span className="text-terminal-green">@{u.alias}</span>
                <span className="text-muted-foreground">{u.email}</span>
                <span className={u.role === 'admin' ? 'text-primary' : 'text-foreground'}>{u.role}</span>
                <span className="text-foreground">{u.score}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
