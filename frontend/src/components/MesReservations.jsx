import { useEffect, useState } from 'react';
import api from '../services/api';

function MesReservations() {
  const [reservations, setReservations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState('');
  const [modification, setModification] = useState(null);

  function charger() {
    setChargement(true);
    api.get('/reservations/mes-reservations')
      .then((res) => setReservations(res.data))
      .catch(() => setMessage('Erreur lors du chargement des réservations.'))
      .finally(() => setChargement(false));
  }

  useEffect(() => { charger(); }, []);

  async function handleAnnuler(id) {
    try {
      await api.patch(`/reservations/${id}/annuler`);
      charger();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de l'annulation.");
    }
  }

  function commencerModification(reservation) {
    setModification({
      id: reservation.id,
      date_debut: reservation.date_debut.slice(0, 16),
      date_fin: reservation.date_fin.slice(0, 16),
    });
  }

  async function validerModification(e) {
    e.preventDefault();
    try {
      await api.put(`/reservations/${modification.id}`, {
        date_debut: modification.date_debut,
        date_fin: modification.date_fin,
      });
      setModification(null);
      charger();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la modification.');
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
              <>
                <button onClick={() => commencerModification(r)}>Modifier</button>
                <button onClick={() => handleAnnuler(r.id)}>Annuler</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {modification && (
        <form onSubmit={validerModification}>
          <h3>Modifier la réservation #{modification.id}</h3>
          <label>
            Début
            <input
              type="datetime-local"
              value={modification.date_debut}
              onChange={(e) => setModification({ ...modification, date_debut: e.target.value })}
              required
            />
          </label>
          <label>
            Fin
            <input
              type="datetime-local"
              value={modification.date_fin}
              onChange={(e) => setModification({ ...modification, date_fin: e.target.value })}
              required
            />
          </label>
          <button type="submit">Valider</button>
          <button type="button" onClick={() => setModification(null)}>Annuler la modification</button>
        </form>
      )}
    </div>
  );
}

export default MesReservations;