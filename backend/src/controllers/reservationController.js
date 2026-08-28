const { Op } = require('sequelize');
const { sequelize, Salle, Reservation, Notification } = require('../models');
const { transitionAutorisee } = require('../utils/reservationTransitions');

async function creerNotification(utilisateur_id, type, message, options = {}) {
  return Notification.create({ utilisateur_id, type, message, lu: false }, options);
}

async function createReservation(req, res) {
  const { salle_id, date_debut, date_fin } = req.body;
  if (!salle_id || !date_debut || !date_fin) {
    return res.status(400).json({ message: 'salle_id, date_debut et date_fin sont requis' });
  }
  const debut = new Date(date_debut);
  const fin = new Date(date_fin);
  if (isNaN(debut) || isNaN(fin)) return res.status(400).json({ message: 'Dates invalides' });
  if (fin <= debut) return res.status(400).json({ message: 'date_fin doit être postérieure à date_debut' });
  if (debut < new Date()) return res.status(400).json({ message: 'Impossible de réserver un créneau dans le passé' });

  const t = await sequelize.transaction();
  try {
    const salle = await Salle.findByPk(salle_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!salle) { await t.rollback(); return res.status(404).json({ message: 'Salle introuvable' }); }

    const conflit = await Reservation.findOne({
      where: {
        salle_id,
        statut: { [Op.ne]: 'annulee' },
        date_debut: { [Op.lt]: fin },
        date_fin: { [Op.gt]: debut },
      },
      transaction: t,
    });
    if (conflit) { await t.rollback(); return res.status(409).json({ message: 'Ce créneau est déjà réservé pour cette salle' }); }

    const reservation = await Reservation.create({
      salle_id, utilisateur_id: req.user.id, date_debut: debut, date_fin: fin, statut: 'en_attente',
    }, { transaction: t });

    await t.commit();
    res.status(201).json(reservation);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
}

async function modifierReservation(req, res) {
  const { date_debut, date_fin } = req.body;
  if (!date_debut || !date_fin) return res.status(400).json({ message: 'date_debut et date_fin sont requis' });
  const debut = new Date(date_debut);
  const fin = new Date(date_fin);
  if (isNaN(debut) || isNaN(fin)) return res.status(400).json({ message: 'Dates invalides' });
  if (fin <= debut) return res.status(400).json({ message: 'date_fin doit être postérieure à date_debut' });
  if (debut < new Date()) return res.status(400).json({ message: 'Impossible de déplacer vers un créneau dans le passé' });

  const t = await sequelize.transaction();
  try {
    const reservation = await Reservation.findByPk(req.params.id, { transaction: t });
    if (!reservation) { await t.rollback(); return res.status(404).json({ message: 'Réservation introuvable' }); }

    const estAuteur = reservation.utilisateur_id === req.user.id;
    const estGestionnaire = ['gestionnaire', 'admin'].includes(req.user.role);
    if (!estAuteur && !estGestionnaire) {
      await t.rollback();
      return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres réservations' });
    }
    if (reservation.statut === 'annulee') {
      await t.rollback();
      return res.status(409).json({ message: 'Impossible de modifier une réservation annulée' });
    }

    await Salle.findByPk(reservation.salle_id, { transaction: t, lock: t.LOCK.UPDATE });

    const conflit = await Reservation.findOne({
      where: {
        salle_id: reservation.salle_id,
        id: { [Op.ne]: reservation.id },
        statut: { [Op.ne]: 'annulee' },
        date_debut: { [Op.lt]: fin },
        date_fin: { [Op.gt]: debut },
      },
      transaction: t,
    });
    if (conflit) { await t.rollback(); return res.status(409).json({ message: 'Ce créneau est déjà réservé pour cette salle' }); }

    reservation.date_debut = debut;
    reservation.date_fin = fin;
    reservation.statut = 'en_attente';
    await reservation.save({ transaction: t });

    await creerNotification(
      reservation.utilisateur_id,
      'modification',
      `Votre réservation #${reservation.id} a été déplacée et repasse en attente de confirmation.`,
      { transaction: t }
    );

    await t.commit();
    res.json(reservation);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
}

async function confirmerReservation(req, res) {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
    if (!transitionAutorisee(reservation.statut, 'confirmee')) {
      return res.status(409).json({ message: `Impossible de confirmer une réservation au statut "${reservation.statut}"` });
    }
    reservation.statut = 'confirmee';
    await reservation.save();

    await creerNotification(reservation.utilisateur_id, 'confirmation', `Votre réservation #${reservation.id} a été confirmée.`);

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function annulerReservation(req, res) {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
    const estAuteur = reservation.utilisateur_id === req.user.id;
    const estGestionnaire = ['gestionnaire', 'admin'].includes(req.user.role);
    if (!estAuteur && !estGestionnaire) {
      return res.status(403).json({ message: 'Vous ne pouvez annuler que vos propres réservations' });
    }
    if (!transitionAutorisee(reservation.statut, 'annulee')) {
      return res.status(409).json({ message: `Impossible d'annuler une réservation au statut "${reservation.statut}"` });
    }
    reservation.statut = 'annulee';
    await reservation.save();

    await creerNotification(reservation.utilisateur_id, 'annulation', `Votre réservation #${reservation.id} a été annulée.`);

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function mesReservations(req, res) {
  const { statut, date } = req.query;
  const where = { utilisateur_id: req.user.id };
  if (statut) where.statut = statut;
  if (date) {
    const jour = new Date(date);
    const lendemain = new Date(jour);
    lendemain.setDate(lendemain.getDate() + 1);
    where.date_debut = { [Op.gte]: jour, [Op.lt]: lendemain };
  }
  const reservations = await Reservation.findAll({ where, include: Salle, order: [['date_debut', 'DESC']] });
  res.json(reservations);
}

async function reservationsParSalle(req, res) {
  const { statut } = req.query;
  const where = { salle_id: req.params.salleId };
  if (statut) where.statut = statut;
  const reservations = await Reservation.findAll({ where, order: [['date_debut', 'DESC']] });
  res.json(reservations);
}

async function calendrier(req, res) {
  const { salle_id, debut, fin } = req.query;
  if (!debut || !fin) return res.status(400).json({ message: 'debut et fin sont requis' });

  const where = {
    statut: { [Op.ne]: 'annulee' },
    date_debut: { [Op.lt]: fin },
    date_fin: { [Op.gt]: debut },
  };
  if (salle_id) where.salle_id = salle_id;

  const reservations = await Reservation.findAll({ where, include: Salle, order: [['date_debut', 'ASC']] });

  const evenements = reservations.map((r) => ({
    id: r.id,
    title: `${r.Salle?.nom || 'Salle'} — ${r.statut}`,
    start: r.date_debut,
    end: r.date_fin,
    statut: r.statut,
    salle_id: r.salle_id,
  }));

  res.json(evenements);
}

module.exports = {
  createReservation, modifierReservation, confirmerReservation, annulerReservation,
  mesReservations, reservationsParSalle, calendrier,
};