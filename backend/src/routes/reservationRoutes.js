const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  createReservation, modifierReservation, confirmerReservation, annulerReservation,
  mesReservations, reservationsParSalle, calendrier,
} = require('../controllers/reservationController');

router.post('/', authenticateToken, createReservation);
router.get('/mes-reservations', authenticateToken, mesReservations);
router.get('/calendrier', authenticateToken, calendrier);
router.get('/salle/:salleId', authenticateToken, authorizeRoles('gestionnaire', 'admin'), reservationsParSalle);
router.put('/:id', authenticateToken, modifierReservation);
router.patch('/:id/confirmer', authenticateToken, authorizeRoles('gestionnaire', 'admin'), confirmerReservation);
router.patch('/:id/annuler', authenticateToken, annulerReservation);

module.exports = router;