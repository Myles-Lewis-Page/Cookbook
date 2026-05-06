const express = require('express');
const { Pool } = require('pg');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 7*24*60*60*1000 }
}));

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS recipes (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      prep_time TEXT,
      cook_time TEXT,
      servings TEXT,
      all_ingredients JSONB NOT NULL DEFAULT '[]',
      steps JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS ingredients (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS suggestions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT,
      title TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('DB ready');
}

function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// AUTH
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.json({ ok: true });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});
app.post('/api/auth/logout', (req, res) => { req.session.destroy(); res.json({ ok: true }); });
app.get('/api/auth/me', (req, res) => { res.json({ isAdmin: !!req.session?.isAdmin }); });

// RECIPES
app.get('/api/recipes/counts', async (req, res) => {
  try {
    const r = await pool.query('SELECT category, COUNT(*) as count FROM recipes GROUP BY category');
    const counts = {};
    r.rows.forEach(row => { counts[row.category] = parseInt(row.count); });
    res.json(counts);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/recipes/recent', async (req, res) => {
  try {
    const r = await pool.query('SELECT id,title,category,created_at FROM recipes ORDER BY created_at DESC LIMIT 6');
    res.json(r.rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/recipes/all', async (req, res) => {
  try {
    const { categories } = req.query;
    let q = 'SELECT id,title,category,all_ingredients,steps FROM recipes';
    const params = [];
    if (categories) { q += ' WHERE category = ANY($1)'; params.push(categories.split(',').map(c=>c.trim())); }
    q += ' ORDER BY title ASC';
    const r = await pool.query(q, params);
    res.json(r.rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/recipes/batch', async (req, res) => {
  try {
    const ids = (req.query.ids||'').split(',').filter(Boolean);
    if (!ids.length) return res.json([]);
    const r = await pool.query('SELECT id,title,category,all_ingredients FROM recipes WHERE id = ANY($1)', [ids]);
    res.json(r.rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const r = await pool.query('SELECT * FROM recipes WHERE id=$1', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/recipes', async (req, res) => {
  try {
    const { category } = req.query;
    let q = 'SELECT id,title,category,prep_time,cook_time,servings,all_ingredients,created_at FROM recipes';
    const params = [];
    if (category) { q += ' WHERE category=$1'; params.push(category); }
    q += ' ORDER BY title ASC';
    const r = await pool.query(q, params);
    res.json(r.rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/recipes', requireAdmin, async (req, res) => {
  try {
    const { title, category, prep_time, cook_time, servings, all_ingredients, steps } = req.body;
    if (!title||!category) return res.status(400).json({ error: 'Missing fields' });
    const r = await pool.query(
      'INSERT INTO recipes (title,category,prep_time,cook_time,servings,all_ingredients,steps) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [title, category, prep_time, cook_time, servings, JSON.stringify(all_ingredients), JSON.stringify(steps)]
    );
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/recipes/:id', requireAdmin, async (req, res) => {
  try {
    const { title, category, prep_time, cook_time, servings, all_ingredients, steps } = req.body;
    const r = await pool.query(
      'UPDATE recipes SET title=$1,category=$2,prep_time=$3,cook_time=$4,servings=$5,all_ingredients=$6,steps=$7 WHERE id=$8 RETURNING *',
      [title, category, prep_time, cook_time, servings, JSON.stringify(all_ingredients), JSON.stringify(steps), req.params.id]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// INGREDIENTS
app.get('/api/ingredients', async (req, res) => {
  try {
    const r = await pool.query('SELECT id,name FROM ingredients ORDER BY name ASC');
    res.json(r.rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/ingredients', requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const r = await pool.query(
      'INSERT INTO ingredients (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING *',
      [name.trim()]
    );
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// SUGGESTIONS
app.get('/api/suggestions', requireAdmin, async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM suggestions WHERE status='pending' ORDER BY created_at DESC");
    res.json(r.rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/suggestions', async (req, res) => {
  try {
    const { name, title, notes } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    const r = await pool.query(
      'INSERT INTO suggestions (name,title,notes) VALUES ($1,$2,$3) RETURNING *',
      [name||null, title, notes||null]
    );
    res.json(r.rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/suggestions/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('UPDATE suggestions SET status=$1 WHERE id=$2', [req.body.status, req.params.id]);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

initDB().then(() => {
  app.listen(PORT, () => console.log(`Running on port ${PORT}`));
}).catch(err => { console.error('DB init failed:', err); process.exit(1); });
