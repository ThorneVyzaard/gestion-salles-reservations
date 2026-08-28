const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const { tauxOccupation, creneauxDemandes } = require('../controllers/statistiqueController');

router.get('/taux-occupation', authenticateToken, authorizeRoles('gestionnaire', 'admin'), tauxOccupation);
router.get('/creneaux-demandes', authenticateToken, authorizeRoles('gestionnaire', 'admin'), creneauxDemandes);

module.exports = router;