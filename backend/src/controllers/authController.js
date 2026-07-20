const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../models');

async function register(req, res) {
  try {
    const { nom, email, password, role } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const utilisateur = await Utilisateur.create({
      nom, email, password_hash, role: role || 'employe',
    });
    res.status(201).json({ id: utilisateur.id, email: utilisateur.email });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) return res.status(401).json({ message: 'Identifiants invalides' });

    const motDePasseValide = await bcrypt.compare(password, utilisateur.password_hash);
    if (!motDePasseValide) return res.status(401).json({ message: 'Identifiants invalides' });

    const token = jwt.sign(
      { id: utilisateur.id, role: utilisateur.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, role: utilisateur.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { register, login };