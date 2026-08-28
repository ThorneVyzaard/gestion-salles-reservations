const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { getEquipements, createEquipement, updateEquipement, deleteEquipement } = require('../controllers/equipementController');

router.get('/', authenticateToken, getEquipements);
router.post('/', authenticateToken, authorizeRoles('gestionnaire', 'admin'), createEquipement);
router.put('/:id', authenticateToken, authorizeRoles('gestionnaire', 'admin'), updateEquipement);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteEquipement);

module.exports = router;