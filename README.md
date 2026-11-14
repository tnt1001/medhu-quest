# Medhu's Quest

Adaptive maths quests for Medhansh (age 4), with Mooshak, Hindu gods and superheroes.
Design doc: https://claude.ai/artifact/8QiaY7xwdvWZMTAWYK7qaQ

## Stack
- Next.js 15 (App Router), React 19, TypeScript
- Netlify (hosting + functions)
- Netlify Database (Postgres), migrations in `netlify/database/migrations/`

## Structure
- `content/skills.ts` - 31-skill map, check items, number words (English + Hindi)
- `content/quests.ts` - story arcs, hero cards, Arc 1 quests (14)
- `lib/engine.ts` - mastery rule + daily recommendation (adaptation rules)
- `app/` - kid side (`/`, `/quest/[day]`, `/cards`) and admin (`/admin`, PIN)
- `app/api/` - state, quest completion, admin data/actions

## Environment variables (Netlify)
- `ADMIN_PIN` - PIN for /admin
- `ADMIN_SECRET` - random string used to sign the admin cookie

## Local development
```
npm install
npm run db:dev          # starts a local Postgres on :54329 with migrations applied
NETLIFY_DB_URL=postgres://postgres@localhost:54329/postgres ADMIN_PIN=1234 npm run dev
```

## Adding Arc 2
Add quests 15-28 to `content/quests.ts`. Game types available: count, flash (scatter/dice/frame5), giveN, conserve, compare, pattern, shapes, mixed, check.
