const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  createReservation, confirmerReservation, annulerReservation, supprimerReservation,
  mesReservations, reservationsParSalle, toutesReservations, calendrier,
} = require('../controllers/reservationController');

router.post('/', authenticateToken, createReservation);
router.get('/', authenticateToken, authorizeRoles('gestionnaire', 'admin'), toutesReservations);
router.get('/mes-reservations', authenticateToken, mesReservations);
router.get('/calendrier', authenticateToken, calendrier);
router.get('/salle/:salleId', authenticateToken, authorizeRoles('gestionnaire', 'admin'), reservationsParSalle);
router.patch('/:id/confirmer', authenticateToken, authorizeRoles('gestionnaire', 'admin'), confirmerReservation);
router.patch('/:id/annuler', authenticateToken, annulerReservation);
router.delete('/:id', authenticateToken, supprimerReservation);

module.exports = router;
