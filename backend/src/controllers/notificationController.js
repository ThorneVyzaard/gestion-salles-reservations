const { Notification } = require('../models');

async function mesNotifications(req, res) {
  const notifications = await Notification.findAll({
    where: { utilisateur_id: req.user.id },
    order: [['createdAt', 'DESC']],
  });
  res.json(notifications);
}

async function marquerLue(req, res) {
  const notification = await Notification.findByPk(req.params.id);
  if (!notification) return res.status(404).json({ message: 'Notification introuvable' });
  if (notification.utilisateur_id !== req.user.id) {
    return res.status(403).json({ message: 'Accès refusé' });
  }
  notification.lu = true;
  await notification.save();
  res.json(notification);
}

module.exports = { mesNotifications, marquerLue };