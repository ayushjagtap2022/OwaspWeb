import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TARGET_DATE = new Date("2026-04-15T00:00:00Z").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = TARGET_DATE - now;
      if (diff <= 0) {
        setIsLive(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLive) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <h2 className="text-5xl md:text-7xl font-cyber text-neon-green animate-neon-pulse-green tracking-wider">
          CTF IS LIVE
        </h2>
      </motion.div>
    );
  }

  if (!timeLeft) return null;

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.minutes },
    { label: "SECS", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 md:gap-8 justify-center">
      {units.map((unit) => (
        <motion.div
          key={unit.label}
          className="flex flex-col items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="relative border border-primary/40 rounded-lg p-4 md:p-6 min-w-[70px] md:min-w-[100px] neon-border-red timer-unit">
            <span className="timer-number text-3xl md:text-5xl font-cyber text-primary animate-neon-pulse tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs md:text-sm font-terminal text-muted-foreground mt-2 tracking-widest">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default CountdownTimer;
