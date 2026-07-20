const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const {
  getSalles, getSalleById, createSalle, updateSalle, deleteSalle, getSallesDisponibles,
} = require('../controllers/salleController');

// Attention à l'ordre : /disponibles doit être déclaré avant /:id
router.get('/disponibles', authenticateToken, getSallesDisponibles);
router.get('/', authenticateToken, getSalles);
router.get('/:id', authenticateToken, getSalleById);
router.post('/', authenticateToken, authorizeRoles('gestionnaire', 'admin'), createSalle);
router.put('/:id', authenticateToken, authorizeRoles('gestionnaire', 'admin'), updateSalle);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteSalle);

module.exports = router;