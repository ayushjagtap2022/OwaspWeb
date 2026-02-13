import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChallenges, getCurrentUser, getEvent, submitFlag, initStore } from '@/lib/store';
import { CATEGORY_LABELS, DIFFICULTY_COLORS, type CategoryKey, type Challenge } from '@/lib/types';
import { GlitchText } from '@/components/GlitchText';

initStore();

const Challenges = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [challenges, setChallenges] = useState(getChallenges());
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, 'correct' | 'wrong' | null>>({});
  const event = getEvent();

  useEffect(() => {
    if (!user) navigate('/register');
  }, [user, navigate]);

  if (!user) return null;

  const isLocked = event.status === 'upcoming';
  const filtered = challenges.filter(c => c.enabled && (!activeCategory || c.category === activeCategory));
  const categories = Object.entries(CATEGORY_LABELS) as [CategoryKey, string][];

  const handleSubmit = (challenge: Challenge) => {
    const flag = flagInputs[challenge.id] || '';
    const { correct } = submitFlag(user.id, challenge.id, flag);
    setResults(prev => ({ ...prev, [challenge.id]: correct ? 'correct' : 'wrong' }));
    if (correct) {
      setChallenges(getChallenges());
      setUser(getCurrentUser());
    }
    // Clear result after 3 seconds for wrong answers
    if (!correct) {
      setTimeout(() => setResults(prev => ({ ...prev, [challenge.id]: null })), 3000);
    }
  };

  return (
    <div className="noise-bg min-h-screen">
      <div className="crt-overlay" />
      <div className="container mx-auto px-4 py-10 space-y-8">
        <GlitchText as="h1" className="text-3xl text-primary text-center">// CHALLENGES</GlitchText>

        {isLocked && (
          <div className="border border-primary/50 bg-primary/5 p-4 text-center">
            <p className="font-mono text-sm text-primary">⚠ EVENT NOT STARTED — Challenges are locked until the countdown reaches zero.</p>
          </div>
        )}

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => setActiveCategory(null)} className={`terminal-btn ${!activeCategory ? 'active' : ''}`}>
            [ all ]
          </button>
          {categories.map(([key, label]) => (
            <button key={key} onClick={() => setActiveCategory(key)} className={`terminal-btn ${activeCategory === key ? 'active' : ''}`}>
              [ {label} ]
            </button>
          ))}
        </div>

        {/* Challenge Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(challenge => {
            const solved = user.solves.includes(challenge.id);
            const result = results[challenge.id];

            return (
              <div
                key={challenge.id}
                className={`border p-5 space-y-3 transition-colors ${
                  solved ? 'border-terminal-green/30 bg-terminal-green/5' :
                  'border-border bg-card/50 hover:border-primary/30'
                } ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-mono text-sm text-foreground">{challenge.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-mono text-xs text-terminal-green">/{CATEGORY_LABELS[challenge.category]}</span>
                      <span className={`font-mono text-xs ${DIFFICULTY_COLORS[challenge.difficulty]}`}>
                        [{challenge.difficulty}]
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-lg text-primary">{challenge.points}</span>
                    <p className="font-mono text-xs text-muted-foreground">{challenge.solveCount} solves</p>
                  </div>
                </div>

                <p className="font-mono text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {challenge.description}
                </p>

                {solved ? (
                  <div className="font-mono text-xs text-terminal-green green-glow">✓ FLAG CAPTURED</div>
                ) : (
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 border border-border px-3 py-1.5">
                      <span className="text-terminal-green font-mono text-xs">$</span>
                      <input
                        value={flagInputs[challenge.id] || ''}
                        onChange={e => setFlagInputs(prev => ({ ...prev, [challenge.id]: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit(challenge)}
                        placeholder="FLAG{...}"
                        className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <button
                      onClick={() => handleSubmit(challenge)}
                      className="px-4 py-1.5 border border-primary text-primary font-mono text-xs hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      submit
                    </button>
                  </div>
                )}

                {result === 'wrong' && (
                  <p className="font-mono text-xs text-primary animate-fade-in">✗ INCORRECT FLAG — Try again</p>
                )}
                {result === 'correct' && (
                  <p className="font-mono text-xs text-terminal-green green-glow animate-fade-in">✓ FLAG ACCEPTED — Points awarded</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Challenges;
