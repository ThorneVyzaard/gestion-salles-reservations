import { useState } from 'react';
import api from '../services/api';

function AvailabilitySearchForm() {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [capaciteMin, setCapaciteMin] = useState('');
  const [resultats, setResultats] = useState(null);
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.get('/salles/disponibles', {
        params: { date_debut: dateDebut, date_fin: dateFin, capacite_min: capaciteMin || undefined },
      });
      setResultats(res.data);
    } catch (err) {
      setMessage('Erreur lors de la recherche de disponibilité.');
    }
  }

  async function handleReserver(salleId) {
    setMessage('');
    try {
      await api.post('/reservations', { salle_id: salleId, date_debut: dateDebut, date_fin: dateFin });
      setMessage('Réservation créée avec succès (en attente de confirmation).');
      setResultats((prev) => prev.filter((s) => s.id !== salleId));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la réservation.');
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Début
          <input type="datetime-local" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required />
        </label>
        <label>
          Fin
          <input type="datetime-local" value={dateFin} onChange={(e) => setDateFin(e.target.value)} required />
        </label>
        <label>
          Capacité minimum
          <input type="number" value={capaciteMin} onChange={(e) => setCapaciteMin(e.target.value)} min="1" />
        </label>
        <button type="submit">Rechercher</button>
      </form>

      {message && <p>{message}</p>}

      {resultats && (
        <ul>
          {resultats.map((salle) => (
            <li key={salle.id}>
              {salle.nom} — {salle.capacite} places
              <button onClick={() => handleReserver(salle.id)}>Réserver</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AvailabilitySearchForm;