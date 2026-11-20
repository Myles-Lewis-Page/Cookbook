# My Cookbook

A personal recipe management app. Recipes are organized into categories (Breakfast, Sides, Lunch, Entrees, Breads & Baked, Sauces & Marinades, Seasonings, Desserts) and shown as recipe cards, with an ingredient list and step-by-step instructions grouped by section.

**Live demo:** https://my-cookbook.up.railway.app

## Features

- Category-based recipe browsing with recipe cards
- Add and edit recipes through a form, with draft/published status
- Ingredient library shared across recipes
- Recipe suggestions submitted and reviewed through the app
- Login for editing, public read-only browsing

## Tech stack

- **Backend:** Node.js, Express, express-session
- **Database:** PostgreSQL (pg)
- **Frontend:** Server-served HTML, CSS and vanilla JavaScript
- **Hosting:** Railway

## Running locally

```bash
npm install
# set DATABASE_URL and SESSION_SECRET in your environment
npm start
```
