# My Cookbook

[![Live demo](https://img.shields.io/badge/Live%20demo-my--cookbook.up.railway.app-2ea44f?style=for-the-badge)](https://my-cookbook.up.railway.app)

A personal recipe management app. Recipes are organized into categories (Breakfast, Sides, Lunch, Entrees, Breads & Baked, Sauces & Marinades, Seasonings, Desserts) and shown as recipe cards, with an ingredient list and step-by-step instructions grouped by section.

![My Cookbook home page](docs/home.jpg)

## Features

- Category-based recipe browsing with recipe cards
- Weekly meal plan page
- "What should I make?" ingredient-based recipe finder
- "Want to try" list for recipes not yet cooked
- Add and edit recipes through an admin form, with draft/published status
- Ingredient library shared across recipes
- Recipe suggestions submitted and reviewed through the app

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
