const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
  getSalles, getSalleById, createSalle, updateSalle, deleteSalle, getSallesDisponibles,
  ajouterEquipementSalle, retirerEquipementSalle, uploaderPhotoSalle,
} = require('../controllers/salleController');

router.get('/disponibles', authenticateToken, getSallesDisponibles);
router.get('/', authenticateToken, getSalles);
router.get('/:id', authenticateToken, getSalleById);
router.post('/', authenticateToken, authorizeRoles('gestionnaire', 'admin'), createSalle);
router.put('/:id', authenticateToken, authorizeRoles('gestionnaire', 'admin'), updateSalle);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteSalle);
router.post('/:id/equipements', authenticateToken, authorizeRoles('gestionnaire', 'admin'), ajouterEquipementSalle);
router.delete('/:id/equipements/:equipementId', authenticateToken, authorizeRoles('gestionnaire', 'admin'), retirerEquipementSalle);
router.post('/:id/photo', authenticateToken, authorizeRoles('gestionnaire', 'admin'), upload.single('photo'), uploaderPhotoSalle);

module.exports = router;