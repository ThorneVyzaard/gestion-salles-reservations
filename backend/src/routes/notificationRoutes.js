const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const {
  mesNotifications, marquerLue, supprimerNotification, supprimerToutesNotifications,
} = require('../controllers/notificationController');

router.get('/', authenticateToken, mesNotifications);
router.patch('/:id/lire', authenticateToken, marquerLue);
router.delete('/:id', authenticateToken, supprimerNotification);
router.delete('/', authenticateToken, supprimerToutesNotifications);

module.exports = router;
