const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const salleRoutes = require('./routes/salleRoutes');
app.use('/api/salles', salleRoutes);

module.exports = app;