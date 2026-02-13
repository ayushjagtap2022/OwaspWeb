import { User, Challenge, Submission, EventState } from './types';

const KEYS = {
  users: 'ctf_users',
  challenges: 'ctf_challenges',
  submissions: 'ctf_submissions',
  event: 'ctf_event',
  currentUser: 'ctf_current_user',
};

function get<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function set<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Seed data
const SEED_CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'Caesar\'s Whisper', description: 'A classic substitution cipher hides a message. Can you decode it?\n\nEncoded: KHOOR ZRUOG', category: 'cryptography', difficulty: 'easy', points: 100, flag: 'FLAG{hello_world}', solveCount: 0, enabled: true, hints: ['Think Roman emperor'] },
  { id: 'c2', title: 'Base Deception', description: 'This string looks encoded. Multiple layers perhaps?\n\nRkxBR3tkMHVibGVfYjY0fQ==', category: 'cryptography', difficulty: 'medium', points: 200, flag: 'FLAG{d0uble_b64}', solveCount: 0, enabled: true, hints: ['Base64 is your friend'] },
  { id: 'c3', title: 'Ghost in the Binary', description: 'An executable hides its secrets. Reverse the logic to find the flag.\n\nif (input === atob("RkxBR3tyM3Yzcl9tM30=")) { grant(); }', category: 'reverse-engineering', difficulty: 'hard', points: 400, flag: 'FLAG{r3v3r_m3}', solveCount: 0, enabled: true, hints: ['atob decodes base64'] },
  { id: 'c4', title: 'Digital Footprint', description: 'Find the hidden email address associated with the username "ctrl_alt_defeat" on a popular code hosting platform.', category: 'osint', difficulty: 'medium', points: 250, flag: 'FLAG{0s1nt_m4st3r}', solveCount: 0, enabled: true, hints: ['Check commit history'] },
  { id: 'c5', title: 'Pixel Secrets', description: 'An image file contains more than meets the eye. Look beyond the pixels.', category: 'steganography', difficulty: 'hard', points: 350, flag: 'FLAG{h1dd3n_p1x3ls}', solveCount: 0, enabled: true, hints: ['Try examining LSB'] },
  { id: 'c6', title: 'XOR Labyrinth', description: 'Each byte has been XORed with a single key. The ciphertext (hex): 1b0e0a1c4e38343c3a28\n\nHint: The flag starts with FLAG', category: 'cryptography', difficulty: 'hard', points: 400, flag: 'FLAG{x0r_k1ng}', solveCount: 0, enabled: true, hints: ['XOR the first byte with F'] },
  { id: 'c7', title: 'Assembly Puzzle', description: 'What value does EAX hold after execution?\n\nmov eax, 5\nmov ebx, 3\nadd eax, ebx\nimul eax, 2', category: 'reverse-engineering', difficulty: 'easy', points: 100, flag: 'FLAG{16}', solveCount: 0, enabled: true, hints: ['Trace the registers step by step'] },
  { id: 'c8', title: 'Social Recon', description: 'The target organization posted a job listing with an unusual requirement. The company domain is "nullsec-corp.example". What technology stack did they mention?', category: 'osint', difficulty: 'easy', points: 150, flag: 'FLAG{r3c0n_pr0}', solveCount: 0, enabled: true, hints: ['Check job boards and cached pages'] },
];

const DEFAULT_EVENT: EventState = {
  status: 'upcoming',
  startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  title: 'OPERATION: ZERO DAY',
};

const ADMIN_USER: User = {
  id: 'admin',
  alias: 'root',
  email: 'admin@ctf.local',
  password: 'admin123',
  role: 'admin',
  score: 0,
  solves: [],
  badges: [],
  createdAt: new Date().toISOString(),
};

export function initStore() {
  if (!localStorage.getItem(KEYS.challenges)) {
    set(KEYS.challenges, SEED_CHALLENGES);
  }
  if (!localStorage.getItem(KEYS.event)) {
    set(KEYS.event, DEFAULT_EVENT);
  }
  if (!localStorage.getItem(KEYS.users)) {
    set(KEYS.users, [ADMIN_USER]);
  }
  if (!localStorage.getItem(KEYS.submissions)) {
    set(KEYS.submissions, []);
  }
}

// Users
export function getUsers(): User[] { return get(KEYS.users, []); }
export function setUsers(users: User[]) { set(KEYS.users, users); }
export function getCurrentUser(): User | null { return get(KEYS.currentUser, null); }
export function setCurrentUser(user: User | null) { set(KEYS.currentUser, user); }

export function registerUser(alias: string, email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  if (users.find(u => u.alias.toLowerCase() === alias.toLowerCase())) {
    return { success: false, error: 'ERROR: alias already exists in database' };
  }
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'ERROR: email already registered' };
  }
  const user: User = {
    id: crypto.randomUUID(),
    alias, email, password,
    role: 'participant',
    score: 0, solves: [], badges: [],
    createdAt: new Date().toISOString(),
  };
  setUsers([...users, user]);
  setCurrentUser(user);
  return { success: true, user };
}

export function loginUser(alias: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const user = users.find(u => u.alias === alias && u.password === password);
  if (!user) return { success: false, error: 'ERROR: invalid credentials' };
  setCurrentUser(user);
  return { success: true, user };
}

export function logoutUser() { localStorage.removeItem(KEYS.currentUser); }

// Challenges
export function getChallenges(): Challenge[] { return get(KEYS.challenges, []); }
export function setChallenges(challenges: Challenge[]) { set(KEYS.challenges, challenges); }

// Submissions
export function getSubmissions(): Submission[] { return get(KEYS.submissions, []); }

export function submitFlag(userId: string, challengeId: string, flag: string): { correct: boolean } {
  const challenges = getChallenges();
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) return { correct: false };

  const correct = flag.trim() === challenge.flag;
  const submission: Submission = {
    id: crypto.randomUUID(),
    userId, challengeId, flag, correct,
    timestamp: new Date().toISOString(),
  };
  const submissions = getSubmissions();
  set(KEYS.submissions, [...submissions, submission]);

  if (correct) {
    // Update solve count
    challenge.solveCount++;
    setChallenges(challenges);
    // Update user score
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (user && !user.solves.includes(challengeId)) {
      user.solves.push(challengeId);
      user.score += challenge.points;
      setUsers(users);
      setCurrentUser(user);
    }
  }
  return { correct };
}

// Event
export function getEvent(): EventState { return get(KEYS.event, DEFAULT_EVENT); }
export function setEvent(event: EventState) { set(KEYS.event, event); }
