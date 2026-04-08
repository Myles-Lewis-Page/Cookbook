# My Cookbook

A personal recipe website built with Next.js, Supabase, and Vercel.

## Setup

### 1. Supabase
1. Go to your Supabase project → SQL Editor
2. Paste and run the contents of `supabase-schema.sql`
3. Go to Project Settings → API and copy:
   - Project URL
   - anon/public key

### 2. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_USERNAME=Myles
ADMIN_PASSWORD=choose_a_strong_password
SESSION_SECRET=any_random_32+_character_string
```

In Vercel, add these same variables under Project → Settings → Environment Variables.

### 3. Run locally
```bash
npm install
npm run dev
```

### 4. Deploy
Push to GitHub — Vercel auto-deploys.

## Pages
- `/` — Homepage with category grid and recent recipes
- `/category/[slug]` — All recipes in a category
- `/recipe/[id]` — Individual recipe view
- `/login` — Admin login (Myles only)
- `/admin/add-recipe` — Add a new recipe (admin only)

## Categories
- Breakfast
- Sides
- Lunch
- Entrees
- Breads & Baked
- Desserts
