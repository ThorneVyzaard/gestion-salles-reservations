const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Salle = sequelize.define('Salle', {
  nom: { type: DataTypes.STRING, allowNull: false },
  capacite: { type: DataTypes.INTEGER, allowNull: false },
  localisation: { type: DataTypes.STRING },
  photo_url: { type: DataTypes.STRING },
}, {
  tableName: 'salles',
  timestamps: true,
});

module.exports = Salle;