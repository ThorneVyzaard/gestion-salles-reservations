const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipement = sequelize.define('Equipement', {
  nom: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: 'equipements',
  timestamps: false,
});

module.exports = Equipement;