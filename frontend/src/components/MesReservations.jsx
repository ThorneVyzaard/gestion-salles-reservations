import { useEffect, useState } from 'react';
import api from '../services/api';

function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState('');

  function charger(estPremierChargement = false) {
    if (estPremierChargement) setChargement(true);
    api.get('/reservations/mes-reservations')
      .then((res) => setReservations(res.data))
      .catch(() => setMessage('Erreur lors du chargement des réservations.'))
      .finally(() => { if (estPremierChargement) setChargement(false); });
  }

  useEffect(() => {
    charger(true);
    const interval = setInterval(() => charger(false), 8000);
    return () => clearInterval(interval);
  }, []);

  async function handleAnnuler(id) {
    try {
      await api.patch(`/reservations/${id}/annuler`);
      charger();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'annulation.");
    }
  }

  async function handleSupprimer(id) {
    if (!window.confirm('Supprimer définitivement cette réservation annulée ?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      charger();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  }

  if (chargement) return <p>Chargement de vos réservations...</p>;

  return (
    <div>
      <h2>Mes réservations</h2>
      {message && <p>{message}</p>}
      <ul>
        {reservations.map((r) => (
          <li key={r.id}>
            {r.Salle?.nom} — du {new Date(r.date_debut).toLocaleString()} au {new Date(r.date_fin).toLocaleString()} — statut : {r.statut}
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

export default MesReservations;
