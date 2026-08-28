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
const reservationRoutes = require('./routes/reservationRoutes');
app.use('/api/reservations', reservationRoutes);
const equipementRoutes = require('./routes/equipementRoutes');
app.use('/api/equipements', equipementRoutes);
app.use('/uploads', express.static('uploads'));
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);
const statistiqueRoutes = require('./routes/statistiqueRoutes');
app.use('/api/statistiques', statistiqueRoutes);
module.exports = app;