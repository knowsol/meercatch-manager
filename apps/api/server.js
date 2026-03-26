const express = require('express');
const cors    = require('cors');
const cron    = require('node-cron');

const app  = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────
app.use('/installations',   require('./routes/installations'));
app.use('/devices',         require('./routes/devices'));
app.use('/managed',         require('./routes/managed'));
app.use('/detections',      require('./routes/detections'));
app.use('/',                require('./routes/falsePositive'));   // POST /detections/:id/false-positive, GET/PATCH /false-positives
app.use('/manager',         require('./routes/manager'));

// ── Health ────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'meercatch-api', port: PORT });
});

// ── Cron: 만료된 pause 자동 처리 (매 10분마다) ───────────
const { expireOldPauses } = require('./services/pauseService');
cron.schedule('*/10 * * * *', () => {
  expireOldPauses().catch((err) =>
    console.error('[cron/expireOldPauses]', err.message)
  );
});

// ── Cron: 60일 경과 탐지 이벤트 자동 삭제 (매일 03:00) ──
cron.schedule('0 3 * * *', async () => {
  const db = require('./utils/db');
  try {
    const { rowCount } = await db.query(
      `DELETE FROM detection_events WHERE created_at < NOW() - INTERVAL '60 days'`
    );
    if (rowCount > 0) console.log(`[cron/cleanup] Deleted ${rowCount} old detection events`);
  } catch (err) {
    console.error('[cron/cleanup]', err.message);
  }
});

// ── 404 / Error ───────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error('[server error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`[meercatch-api] Running on port ${PORT}`));
