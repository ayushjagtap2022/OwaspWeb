import { motion } from "framer-motion";
import { Trophy, FileText, Flag, Users } from "lucide-react";

const archiveData = [
  {
    year: 2026,
    status: "upcoming",
    winners: [],
    challenges: 0,
    teams: 0,
  },
  {
    year: 2025,
    status: "completed",
    winners: [
      { rank: 1, team: "NullPointers", score: 8750 },
      { rank: 2, team: "ByteBusters", score: 7920 },
      { rank: 3, team: "CipherSquad", score: 7100 },
    ],
    challenges: 45,
    teams: 120,
    writeups: ["Web Challenge Writeup", "Crypto Finals Writeup", "RE Deep Dive"],
  },
  {
    year: 2024,
    status: "completed",
    winners: [
      { rank: 1, team: "RootKillers", score: 6800 },
      { rank: 2, team: "H4ckTh3Pl4n3t", score: 6200 },
      { rank: 3, team: "BinaryStorm", score: 5950 },
    ],
    challenges: 38,
    teams: 85,
    writeups: ["OSINT Masterclass", "Binary Exploitation Guide"],
  },
];

const Archive = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-cyber text-3xl md:text-4xl text-primary text-center mb-2 tracking-wider neon-text-red">
            ARCHIVE
          </h1>
          <p className="text-center font-terminal text-muted-foreground mb-12 text-sm">
            {'>'} History of the battlefield_
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />

          {archiveData.map((entry, i) => (
            <motion.div
              key={entry.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative mb-12 pl-12 md:pl-0 ${i % 2 === 0 ? "md:pr-[52%]" : "md:pl-[52%]"}`}
            >
              {/* Dot */}
              <div className="absolute left-[13px] md:left-1/2 md:-translate-x-1/2 top-0 w-3 h-3 rounded-full bg-primary border-2 border-primary neon-border-red" />

              <div className="border border-border rounded-lg bg-card/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-cyber text-xl text-primary tracking-wider">
                    XPLOITATHON {entry.year}
                  </h3>
                  {entry.status === "upcoming" && (
                    <span className="font-terminal text-xs text-neon-green animate-neon-pulse-green">UPCOMING</span>
                  )}
                </div>

                {entry.status === "upcoming" ? (
                  <p className="font-terminal text-sm text-muted-foreground">Coming soon...</p>
                ) : (
                  <>
                    <div className="flex gap-4 mb-4 text-xs font-terminal text-muted-foreground">
                      <span className="flex items-center gap-1"><Flag size={12} /> {entry.challenges} challenges</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {entry.teams} teams</span>
                    </div>

                    {entry.winners && entry.winners.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-terminal text-xs text-muted-foreground mb-2 tracking-wider flex items-center gap-1">
                          <Trophy size={12} className="text-primary" /> FINAL STANDINGS
                        </h4>
                        {entry.winners.map((w) => (
                          <div key={w.rank} className="flex justify-between py-1 px-2 text-sm rounded bg-secondary/30 mb-1">
                            <span className="font-terminal text-foreground">#{w.rank} {w.team}</span>
                            <span className="font-cyber text-xs text-primary">{w.score} pts</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {entry.writeups && entry.writeups.length > 0 && (
                      <div>
                        <h4 className="font-terminal text-xs text-muted-foreground mb-2 tracking-wider flex items-center gap-1">
                          <FileText size={12} /> WRITEUPS
                        </h4>
                        {entry.writeups.map((w) => (
                          <p key={w} className="text-sm text-neon-green font-terminal cursor-pointer hover:underline">
                            → {w}
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Archive;
