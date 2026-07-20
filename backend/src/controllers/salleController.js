const { Op } = require('sequelize');
const { Salle, Equipement, Reservation } = require('../models');

async function getSalles(req, res) {
  const salles = await Salle.findAll({ include: Equipement });
  res.json(salles);
}

async function getSalleById(req, res) {
  const salle = await Salle.findByPk(req.params.id, { include: Equipement });
  if (!salle) return res.status(404).json({ message: 'Salle introuvable' });
  res.json(salle);
}

async function createSalle(req, res) {
  const { nom, capacite, localisation, photo_url } = req.body;
  const salle = await Salle.create({ nom, capacite, localisation, photo_url });
  res.status(201).json(salle);
}

async function updateSalle(req, res) {
  const salle = await Salle.findByPk(req.params.id);
  if (!salle) return res.status(404).json({ message: 'Salle introuvable' });
  await salle.update(req.body);
  res.json(salle);
}

async function deleteSalle(req, res) {
  const salle = await Salle.findByPk(req.params.id);
  if (!salle) return res.status(404).json({ message: 'Salle introuvable' });
  await salle.destroy();
  res.status(204).send();
}

// Détection de disponibilité
async function getSallesDisponibles(req, res) {
  const { date_debut, date_fin, capacite_min } = req.query;

  if (!date_debut || !date_fin) {
    return res.status(400).json({ message: 'date_debut et date_fin sont requis' });
  }

  const whereSalle = capacite_min
    ? { capacite: { [Op.gte]: capacite_min } }
    : {};

  const salles = await Salle.findAll({
    where: whereSalle,
    include: [
      {
        model: Reservation,
        required: false,
        where: {
          statut: { [Op.ne]: 'annulee' },
          // chevauchement : une résa bloque le créneau si elle commence
          // avant la fin demandée ET finit après le début demandé
          date_debut: { [Op.lt]: date_fin },
          date_fin: { [Op.gt]: date_debut },
        },
      },
    ],
  });

  const sallesDisponibles = salles.filter((salle) => salle.Reservations.length === 0);
  res.json(sallesDisponibles);
}

module.exports = {
  getSalles, getSalleById, createSalle, updateSalle, deleteSalle, getSallesDisponibles,
};