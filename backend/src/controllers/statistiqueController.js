const { Op } = require('sequelize');
const { Salle, Reservation } = require('../models');

async function tauxOccupation(req, res) {
  const { debut, fin } = req.query;
  if (!debut || !fin) return res.status(400).json({ message: 'debut et fin sont requis' });

  const debutDate = new Date(debut);
  const finDate = new Date(fin);
  const dureeTotaleHeures = (finDate - debutDate) / (1000 * 60 * 60);

  const salles = await Salle.findAll();
  const resultats = [];

  for (const salle of salles) {
    const reservations = await Reservation.findAll({
      where: {
        salle_id: salle.id,
        statut: { [Op.ne]: 'annulee' },
        date_debut: { [Op.lt]: finDate },
        date_fin: { [Op.gt]: debutDate },
      },
    });

    const heuresReservees = reservations.reduce((total, r) => {
      const debutEffectif = r.date_debut > debutDate ? r.date_debut : debutDate;
      const finEffective = r.date_fin < finDate ? r.date_fin : finDate;
      return total + (finEffective - debutEffectif) / (1000 * 60 * 60);
    }, 0);

    resultats.push({
      salle_id: salle.id,
      salle_nom: salle.nom,
      heures_reservees: Math.round(heuresReservees * 10) / 10,
      taux_occupation: dureeTotaleHeures > 0 ? Math.round((heuresReservees / dureeTotaleHeures) * 1000) / 10 : 0,
    });
  }

  resultats.sort((a, b) => b.taux_occupation - a.taux_occupation);
  res.json(resultats);
}

async function creneauxDemandes(req, res) {
  const { debut, fin } = req.query;
  if (!debut || !fin) return res.status(400).json({ message: 'debut et fin sont requis' });

  const reservations = await Reservation.findAll({
    where: {
      statut: { [Op.ne]: 'annulee' },
      date_debut: { [Op.gte]: new Date(debut), [Op.lt]: new Date(fin) },
    },
  });

  const compteurParHeure = {};
  for (const r of reservations) {
    const heure = new Date(r.date_debut).getHours();
    const cle = `${heure}h-${heure + 1}h`;
    compteurParHeure[cle] = (compteurParHeure[cle] || 0) + 1;
  }

  const resultats = Object.entries(compteurParHeure)
    .map(([creneau, nombre]) => ({ creneau, nombre }))
    .sort((a, b) => b.nombre - a.nombre);

  res.json(resultats);
}

module.exports = { tauxOccupation, creneauxDemandes };