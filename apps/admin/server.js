const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = process.env.PORT    || 8082;
const API_URL = process.env.PUBLIC_API_URL || process.env.API_URL || 'http://192.168.0.200:4002';

// Inject runtime config — browser JS reads window.API_URL
app.get('/config.js', (_req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.API_URL = '${API_URL}';`);
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'meercatch-admin', port: PORT, apiUrl: API_URL }));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`[meercatch-admin] Running on port ${PORT}`));
