const { Equipement } = require('../models');

async function getEquipements(req, res) {
  const equipements = await Equipement.findAll();
  res.json(equipements);
}

async function createEquipement(req, res) {
  try {
    const { nom } = req.body;
    if (!nom) return res.status(400).json({ message: 'nom est requis' });
    const equipement = await Equipement.create({ nom });
    res.status(201).json(equipement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function updateEquipement(req, res) {
  const equipement = await Equipement.findByPk(req.params.id);
  if (!equipement) return res.status(404).json({ message: 'Équipement introuvable' });
  await equipement.update(req.body);
  res.json(equipement);
}

async function deleteEquipement(req, res) {
  const equipement = await Equipement.findByPk(req.params.id);
  if (!equipement) return res.status(404).json({ message: 'Équipement introuvable' });
  await equipement.destroy();
  res.status(204).send();
}

module.exports = { getEquipements, createEquipement, updateEquipement, deleteEquipement };