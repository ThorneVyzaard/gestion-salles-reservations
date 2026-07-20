const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reservation = sequelize.define('Reservation', {
  date_debut: { type: DataTypes.DATE, allowNull: false },
  date_fin: { type: DataTypes.DATE, allowNull: false },
  statut: {
    type: DataTypes.ENUM('en_attente', 'confirmee', 'annulee'),
    defaultValue: 'en_attente',
  },
}, {
  tableName: 'reservations',
  timestamps: true,
});

module.exports = Reservation;