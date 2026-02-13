

# 🔴 CTF Platform — Full Build Plan

## Overview
A Mr. Robot-themed Capture The Flag competition platform built as a complete frontend experience with localStorage-based state management, designed to be wired to a Supabase backend later for the real event.

---

## 1. Theme & Design System
- **Dark hacker aesthetic**: Near-black background (#0a0a0a), red accent (#ff0000), matrix green (#00ff41), muted grey text
- **Monospace typography** (Share Tech Mono / JetBrains Mono feel via Google Fonts)
- **CRT effects**: Scanline overlay, subtle screen flicker, background noise grain
- **Glitch text animations** on headings
- **Terminal-style UI elements**: Blinking cursors, typed text, command-prompt styling

## 2. Landing Page — Psychological Entry Gate
- **Terminal intro overlay**: Fake boot sequence with typing animation ("access denied... initializing secure terminal... authentication required...")
- **Hero section**: Glitch-animated title with a command-prompt feel, not a typical marketing hero
- **Manifesto-style "About" section**: What the CTF is, written in hacker tone
- **Challenge category preview**: Terminal-styled toggle buttons (`[ crypt ] [ rev ] [ osint ] [ stego ]`) showing point ranges but locked descriptions
- **Countdown timer**: Large terminal-style countdown to event start, with unlock behavior
- **Registration CTA**: Prominent, red-glowing call to action
- **Encrypted-style footer**: Stylized with encoded text aesthetic

## 3. Registration Flow
- Hacker-themed multi-step form: alias → email → password
- Terminal-style validation messages ("ERROR: alias already exists", "USER CREATED SUCCESSFULLY")
- Fake terminal confirmation animation on success
- Redirect to challenges page after registration
- Data stored in localStorage for now

## 4. Challenges Page (Authenticated Only)
- Category filter bar styled as terminal commands
- Challenge cards showing title, category, difficulty, points, solve count
- Difficulty badges (easy/medium/hard/insane) with color coding
- Flag submission input per challenge with instant validation
- Locked state when event hasn't started (driven by countdown)
- Descriptions hidden until logged in

## 5. Leaderboard Page
- Real-time-styled ranking table with alias, score, solves, rank tier
- Rank tier system: Script Kiddie → Operator → Exploit Architect → Root
- Animated score updates
- Top 3 highlighted with special styling

## 6. Admin Dashboard
- Toggle event status (upcoming / live / ended)
- Add/edit/delete challenges dynamically
- Edit points and toggle categories
- View registered users
- All persisted to localStorage (Supabase-ready structure)

## 7. Gamification Layer
- Badge system with visual icons for achievements
- Rank tiers based on score thresholds displayed on leaderboard and user profile
- Progress indicators per category

## 8. Sound & Polish
- Subtle terminal beep on button interactions
- Red hover glow on CTAs
- Smooth page transitions
- Responsive design for mobile/tablet

## 9. State Architecture (localStorage, Supabase-Ready)
- Centralized state model matching the data models from your algorithms doc (User, Challenge, Submission)
- Auth state with role-based access (participant vs admin)
- Challenge data loaded from a local JSON structure matching your `challenges.json` format
- All state operations abstracted into hooks so swapping to Supabase later is a clean refactor

