# TechStore — Ecommerce Platform

Full-featured ecommerce store with MTN Mobile Money + Airtel Money payments, loyalty rewards, live support chat and a 1,000+ product catalogue.

**Stack:** React + Vite + TailwindCSS · Node.js + Express · PostgreSQL (Supabase) · Socket.io  
**Payments:** MTN Mobile Money · Airtel Money  
**Brand:** Blue #1A56DB · Green #057A55

---

## Day 1 Setup — Follow These Steps Exactly

### Step 1 — Initialise the repository

```bash
cd techstore
git init
git remote add origin https://github.com/YOUR_USERNAME/techstore.git
```

### Step 2 — Set up the backend

```bash
cd backend
npm install
copy .env.example .env
```

Open `.env` and fill in your Supabase `DATABASE_URL`.
Get it from: **Supabase → Settings → Database → Connection string → URI mode**

### Step 3 — Push database schema to Supabase

```bash
npx prisma db push
npx prisma generate
```

You should see: **"Your database is now in sync with your Prisma schema."**
Check Supabase dashboard → Table Editor — all tables should be there.

### Step 4 — Set up the frontend

```bash
cd ../frontend
npm install
copy .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Supabase → Settings → API.

### Step 5 — Run both servers

Open two terminals in VS Code:

**Terminal 1 — Backend:**
```bash
cd backend && npm run dev
```
Should show: **TechStore API running on port 3000**

**Terminal 2 — Frontend:**
```bash
cd frontend && npm run dev
```
Open Chrome → `http://localhost:5173`

### Step 6 — Push to GitHub

```bash
git add .
git commit -m "Day 1: Project structure, schema, dependencies"
git push -u origin main
```

---

## Daily Commands

| Command | What it does | Run from |
|---|---|---|
| `npm run dev` | Start backend server | backend/ |
| `npm run dev` | Start React dev server | frontend/ |
| `npx prisma db push` | Sync schema to Supabase | backend/ |
| `npx prisma generate` | Regenerate Prisma client | backend/ |
| `npx prisma studio` | Visual database browser | backend/ |
| `node prisma/seed.js` | Load seed data | backend/ |
| `git add . && git commit -m "Day X" && git push` | Save all work to GitHub | root/ |

---

## Environment Variables — Fill These First

### backend/.env
- `DATABASE_URL` → Supabase → Settings → Database → URI
- `SUPABASE_SERVICE_KEY` → Supabase → Settings → API → service_role
- `JWT_SECRET` → run: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### frontend/.env
- `VITE_SUPABASE_URL` → Supabase → Settings → API → Project URL
- `VITE_SUPABASE_ANON_KEY` → Supabase → Settings → API → anon key
- `VITE_API_URL` → `http://localhost:3000/api`