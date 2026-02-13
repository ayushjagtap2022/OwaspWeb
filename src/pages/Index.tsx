import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TerminalOverlay } from '@/components/TerminalOverlay';
import { GlitchText } from '@/components/GlitchText';
import CountdownTimer from '@/components/CountdownTimer';
import { getEvent, getChallenges, getCurrentUser, initStore } from '@/lib/store';
import { CATEGORY_LABELS, type CategoryKey } from '@/lib/types';

initStore();

const Index = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const event = getEvent();
  const challenges = getChallenges();
  const user = getCurrentUser();

  const handleOverlayComplete = useCallback(() => setShowOverlay(false), []);

  const categories = Object.entries(CATEGORY_LABELS) as [CategoryKey, string][];
  const filteredChallenges = activeCategory
    ? challenges.filter(c => c.category === activeCategory)
    : challenges;

  const categoryStats = categories.map(([key]) => {
    const cats = challenges.filter(c => c.category === key);
    const minPts = Math.min(...cats.map(c => c.points));
    const maxPts = Math.max(...cats.map(c => c.points));
    return { key, count: cats.length, range: `${minPts}-${maxPts} pts` };
  });

  return (
    <div className={`noise-bg min-h-screen ${showOverlay ? 'bg-black' : 'main-page-bg'}`}>
      <div className="crt-overlay" />
      {showOverlay && <TerminalOverlay onComplete={handleOverlayComplete} />}

      {/* Hero */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center relative">
        <div className="space-y-6 max-w-3xl w-full flex flex-col items-center">
          <p className="text-terminal-green font-mono text-base md:text-lg green-glow blink-cursor">
            {'> root@ctf:~# ./init_operation'}
          </p>
          <h1 className="font-mr-robot hero-title-glow hero-title-scatter text-5xl md:text-8xl lg:text-9xl text-primary tracking-wider mb-4 text-center">
            XPLOITATHON
          </h1>
          <p className="text-muted-foreground font-mono text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            A capture-the-flag competition for those who see beyond the screen.
            Crack ciphers. Reverse binaries. Uncover hidden truths.
          </p>
          <div className="pt-4">
            <CountdownTimer />
          </div>
          <div className="pt-6">
            {user ? (
              <Link
                to="/challenges"
                className="inline-block px-8 py-3 border-2 border-primary text-primary font-mono text-sm uppercase tracking-widest red-glow pulse-ring transition-all hover:bg-primary hover:text-primary-foreground"
              >
                [ Enter Terminal ]
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-block px-8 py-3 border-2 border-primary text-primary font-mono text-sm uppercase tracking-widest red-glow pulse-ring transition-all hover:bg-primary hover:text-primary-foreground"
              >
                [ Initialize Access ]
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <GlitchText text="// MANIFESTO" as="h2" className="text-2xl text-primary" />
          <div className="border border-border p-6 space-y-4 bg-card/50">
            <p className="font-mono text-sm text-foreground leading-relaxed">
              <span className="text-terminal-green">$</span> This is not a game. This is a test.
            </p>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              We built this CTF for operators who think differently. Every challenge is a locked door.
              Every flag is proof you belong. No hand-holding. No hints for the lazy.
              You either crack it, or you don't.
            </p>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              Four domains. Eight challenges. Infinite bragging rights.
            </p>
          </div>
        </div>
      </section>

      {/* Challenge Categories */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <GlitchText text="// CHALLENGE MATRIX" as="h2" className="text-2xl text-primary text-center" />
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`terminal-btn ${!activeCategory ? 'active' : ''}`}
            >
              [ all ]
            </button>
            {categories.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`terminal-btn ${activeCategory === key ? 'active' : ''}`}
              >
                [ {label} ]
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {(activeCategory
              ? categoryStats.filter(s => s.key === activeCategory)
              : categoryStats
            ).map(stat => (
              <div key={stat.key} className="border border-border p-5 bg-card/30 hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-terminal-green text-sm">
                    /{CATEGORY_LABELS[stat.key]}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{stat.count} challenges</span>
                </div>
                <div className="mt-2 font-mono text-xs text-muted-foreground">{stat.range}</div>
                <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60 rounded-full" style={{ width: `${(stat.count / challenges.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          {!user && (
            <p className="text-center font-mono text-xs text-muted-foreground">
              <span className="text-primary">⚠</span> Authentication required to access challenge details
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <p className="font-mono text-xs text-muted-foreground tracking-widest">
            4F 50 45 52 41 54 49 4F 4E 3A 20 5A 45 52 4F 20 44 41 59
          </p>
          <p className="font-mono text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} // All flags are fabricated. No systems were harmed.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
