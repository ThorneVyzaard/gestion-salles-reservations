const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Utilisateur = sequelize.define('Utilisateur', {
  nom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM('employe', 'gestionnaire', 'admin'),
    defaultValue: 'employe',
  },
}, {
  tableName: 'utilisateurs',
  timestamps: true,
});

module.exports = Utilisateur;