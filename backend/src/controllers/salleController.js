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

async function getSallesDisponibles(req, res) {
  const { date_debut, date_fin, capacite_min } = req.query;
  if (!date_debut || !date_fin) {
    return res.status(400).json({ message: 'date_debut et date_fin sont requis' });
  }
  const whereSalle = capacite_min ? { capacite: { [Op.gte]: capacite_min } } : {};
  const salles = await Salle.findAll({
    where: whereSalle,
    include: [{
      model: Reservation,
      required: false,
      where: {
        statut: { [Op.ne]: 'annulee' },
        date_debut: { [Op.lt]: date_fin },
        date_fin: { [Op.gt]: date_debut },
      },
    }],
  });
  const sallesDisponibles = salles.filter((salle) => salle.Reservations.length === 0);
  res.json(sallesDisponibles);
}

async function ajouterEquipementSalle(req, res) {
  try {
    const salle = await Salle.findByPk(req.params.id);
    if (!salle) return res.status(404).json({ message: 'Salle introuvable' });
    const equipement = await Equipement.findByPk(req.body.equipement_id);
    if (!equipement) return res.status(404).json({ message: 'Équipement introuvable' });
    await salle.addEquipement(equipement);
    const salleMaj = await Salle.findByPk(req.params.id, { include: Equipement });
    res.json(salleMaj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function retirerEquipementSalle(req, res) {
  try {
    const salle = await Salle.findByPk(req.params.id);
    if (!salle) return res.status(404).json({ message: 'Salle introuvable' });
    const equipement = await Equipement.findByPk(req.params.equipementId);
    if (!equipement) return res.status(404).json({ message: 'Équipement introuvable' });
    await salle.removeEquipement(equipement);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function uploaderPhotoSalle(req, res) {
  const salle = await Salle.findByPk(req.params.id);
  if (!salle) return res.status(404).json({ message: 'Salle introuvable' });
  if (!req.file) return res.status(400).json({ message: 'Aucun fichier reçu (champ attendu : "photo")' });
  salle.photo_url = `/uploads/salles/${req.file.filename}`;
  await salle.save();
  res.json(salle);
}

module.exports = {
  getSalles, getSalleById, createSalle, updateSalle, deleteSalle, getSallesDisponibles,
  ajouterEquipementSalle, retirerEquipementSalle, uploaderPhotoSalle,
};