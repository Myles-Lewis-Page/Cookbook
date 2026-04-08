# My Cookbook

## Setup

### 1. Supabase — Database
1. Go to your Supabase project → SQL Editor
2. Paste and run the contents of `supabase-schema.sql`

### 2. Supabase — Create your admin account
1. Go to Authentication → Users → Add user
2. Enter your email and a password — this is your login

### 3. Vercel — Environment Variables
Go to your Vercel project → Settings → Environment Variables and add:

| Name | Value |
|------|-------|
| NEXT_PUBLIC_SUPABASE_URL | Your Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Your Supabase anon key |

Find these in Supabase → Project Settings → API

### 4. Upload to GitHub
Upload all files to your GitHub repo — Vercel will auto-deploy.

## File structure to upload
Upload these files maintaining their folder structure:
- package.json
- next.config.js
- tailwind.config.js
- postcss.config.js
- tsconfig.json
- middleware.ts
- .gitignore
- app/layout.tsx
- app/globals.css
- app/page.tsx
- app/login/page.tsx
- app/api/recipes/route.ts
- app/admin/add-recipe/page.tsx
- app/category/[slug]/page.tsx
- app/recipe/[id]/page.tsx
- components/Nav.tsx
- lib/supabase.ts
- lib/types.ts
