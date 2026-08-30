import { useEffect, useState } from 'react';
import api from '../services/api';

function GestionReservations() {
  const [reservations, setReservations] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState('en_attente');
  const [message, setMessage] = useState('');

  function charger() {
    const params = filtreStatut ? { statut: filtreStatut } : {};
    api.get('/reservations', { params }).then((res) => setReservations(res.data));
  }

  useEffect(() => {
    charger();
    const interval = setInterval(charger, 8000);
    return () => clearInterval(interval);
  }, [filtreStatut]);

  async function handleConfirmer(id) {
    setMessage('');
    try {
      await api.patch(`/reservations/${id}/confirmer`);
      charger();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la confirmation.');
    }
  }

  async function handleAnnuler(id) {
    setMessage('');
    try {
      await api.patch(`/reservations/${id}/annuler`);
      charger();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'annulation.");
    }
  }

  async function handleSupprimer(id) {
    setMessage('');
    if (!window.confirm('Supprimer définitivement cette réservation annulée ?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      charger();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  }

  return (
    <div>
      <h2>Gestion des réservations</h2>
      <label>
        Filtrer par statut
        <select value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
          <option value="en_attente">En attente</option>
          <option value="confirmee">Confirmée</option>
          <option value="annulee">Annulée</option>
          <option value="">Toutes</option>
        </select>
      </label>

      {message && <p>{message}</p>}

      <ul>
        {reservations.map((r) => (
          <li key={r.id}>
            {r.Salle?.nom} — {r.Utilisateur?.nom} ({r.Utilisateur?.email}) — du{' '}
            {new Date(r.date_debut).toLocaleString()} au {new Date(r.date_fin).toLocaleString()} — {r.statut}
            {r.statut === 'en_attente' && (
              <button onClick={() => handleConfirmer(r.id)}>Confirmer</button>
            )}
            {r.statut !== 'annulee' && (
              <button onClick={() => handleAnnuler(r.id)}>Annuler</button>
            )}
            {r.statut === 'annulee' && (
              <button onClick={() => handleSupprimer(r.id)}>Supprimer</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestionReservations;
