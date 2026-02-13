export interface User {
  id: string;
  alias: string;
  email: string;
  password: string;
  role: 'participant' | 'admin';
  score: number;
  solves: string[];
  badges: string[];
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'cryptography' | 'reverse-engineering' | 'osint' | 'steganography';
  difficulty: 'easy' | 'medium' | 'hard' | 'insane';
  points: number;
  flag: string;
  solveCount: number;
  enabled: boolean;
  hints: string[];
}

export interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  flag: string;
  correct: boolean;
  timestamp: string;
}

export interface EventState {
  status: 'upcoming' | 'live' | 'ended';
  startTime: string;
  endTime: string;
  title: string;
}

export type CategoryKey = Challenge['category'];

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  cryptography: 'crypt',
  'reverse-engineering': 'rev',
  osint: 'osint',
  steganography: 'stego',
};

export const DIFFICULTY_COLORS: Record<Challenge['difficulty'], string> = {
  easy: 'text-terminal-green',
  medium: 'text-terminal-amber',
  hard: 'text-primary',
  insane: 'text-purple-500',
};

export const RANK_TIERS = [
  { name: 'Script Kiddie', minScore: 0, color: 'text-muted-foreground' },
  { name: 'Operator', minScore: 200, color: 'text-terminal-amber' },
  { name: 'Exploit Architect', minScore: 500, color: 'text-primary' },
  { name: 'Root', minScore: 1000, color: 'text-terminal-green' },
] as const;

export function getRank(score: number) {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (score >= RANK_TIERS[i].minScore) return RANK_TIERS[i];
  }
  return RANK_TIERS[0];
}
