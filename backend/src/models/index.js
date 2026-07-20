const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Salle = require('./Salle');
const Equipement = require('./Equipement');
const Reservation = require('./Reservation');

// Salle <-> Equipement : many-to-many
Salle.belongsToMany(Equipement, { through: 'salle_equipement' });
Equipement.belongsToMany(Salle, { through: 'salle_equipement' });

// Reservation appartient à une Salle et à un Utilisateur
Salle.hasMany(Reservation, { foreignKey: 'salle_id' });
Reservation.belongsTo(Salle, { foreignKey: 'salle_id' });

Utilisateur.hasMany(Reservation, { foreignKey: 'utilisateur_id' });
Reservation.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

module.exports = { sequelize, Utilisateur, Salle, Equipement, Reservation };