const sequelize = require('../config/database');
const Utilisateur = require('./Utilisateur');
const Salle = require('./Salle');
const Equipement = require('./Equipement');
const Reservation = require('./Reservation');
const Notification = require('./Notification');

Salle.belongsToMany(Equipement, { through: 'salle_equipement' });
Equipement.belongsToMany(Salle, { through: 'salle_equipement' });

Salle.hasMany(Reservation, { foreignKey: 'salle_id' });
Reservation.belongsTo(Salle, { foreignKey: 'salle_id' });

Utilisateur.hasMany(Reservation, { foreignKey: 'utilisateur_id' });
Reservation.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

Utilisateur.hasMany(Notification, { foreignKey: 'utilisateur_id' });
Notification.belongsTo(Utilisateur, { foreignKey: 'utilisateur_id' });

module.exports = { sequelize, Utilisateur, Salle, Equipement, Reservation, Notification };