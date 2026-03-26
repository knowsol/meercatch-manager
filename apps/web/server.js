const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT    || 3002;
// PUBLIC_API_URL  = browser-facing URL  (e.g. http://192.168.0.200:4002)
// API_URL         = Docker-internal URL (e.g. http://api:4002) — server-side only
const API_URL = process.env.PUBLIC_API_URL || process.env.API_URL || 'http://192.168.0.200:4002';

// Inject runtime config so HTML pages don't need hardcoded API URLs
app.get('/config.js', (_req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.API_URL = '${API_URL}';`);
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'meercatch-manager', port: PORT, apiUrl: API_URL }));

// SPA fallback — /dashboard, /false-positive, /pause direct access
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`[meercatch-manager] Running on port ${PORT}`));
