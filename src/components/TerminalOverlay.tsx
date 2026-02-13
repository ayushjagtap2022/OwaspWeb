import { useState, useEffect } from 'react';

const BOOT_LINES = [
  { text: '> SYSTEM BOOT INITIATED...', delay: 0 },
  { text: '> Loading kernel modules.......... OK', delay: 400 },
  { text: '> Mounting encrypted filesystem... OK', delay: 800 },
  { text: '> Initializing network stack...... OK', delay: 1200 },
  { text: '> Scanning for vulnerabilities.... DETECTED', delay: 1600 },
  { text: '> ACCESS DENIED', delay: 2200 },
  { text: '> Bypassing authentication........', delay: 2600 },
  { text: '> ACCESS GRANTED', delay: 3200 },
  { text: '> Welcome to OPERATION: ZERO DAY', delay: 3600 },
];

export function TerminalOverlay({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );
    const finishTimer = setTimeout(() => setDone(true), 4200);
    const removeTimer = setTimeout(onComplete, 4800);
    return () => { timers.forEach(clearTimeout); clearTimeout(finishTimer); clearTimeout(removeTimer); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${done ? 'opacity-0' : 'opacity-100'}`}>
      <div className="max-w-2xl w-full px-6">
        <div className="space-y-2">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <p
              key={i}
              className={`font-mono text-sm animate-fade-in ${
                line.text.includes('DENIED') ? 'text-primary' :
                line.text.includes('GRANTED') || line.text.includes('OK') ? 'text-terminal-green' :
                line.text.includes('DETECTED') ? 'text-terminal-amber' :
                'text-foreground'
              }`}
            >
              {line.text}
              {i === visibleLines - 1 && <span className="ml-1 animate-pulse">█</span>}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
