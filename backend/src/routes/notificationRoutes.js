const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const { mesNotifications, marquerLue } = require('../controllers/notificationController');

router.get('/', authenticateToken, mesNotifications);
router.patch('/:id/lire', authenticateToken, marquerLue);

module.exports = router;