const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  message: { type: DataTypes.STRING, allowNull: false },
  type: {
    type: DataTypes.ENUM('confirmation', 'modification', 'annulation'),
    allowNull: false,
  },
  lu: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'notifications',
  timestamps: true,
});

module.exports = Notification;