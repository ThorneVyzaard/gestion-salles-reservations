import { useState } from 'react';
import api from '../services/api';

function StatisticsView() {
  const [debut, setDebut] = useState('');
  const [fin, setFin] = useState('');
  const [occupation, setOccupation] = useState(null);
  const [creneaux, setCreneaux] = useState(null);
  const [message, setMessage] = useState('');

  async function charger(e) {
    e.preventDefault();
    setMessage('');
    try {
      const [resOccupation, resCreneaux] = await Promise.all([
        api.get('/statistiques/taux-occupation', { params: { debut, fin } }),
        api.get('/statistiques/creneaux-demandes', { params: { debut, fin } }),
      ]);
      setOccupation(resOccupation.data);
      setCreneaux(resCreneaux.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors du chargement des statistiques.');
    }
  }

  const maxCreneau = creneaux ? Math.max(...creneaux.map((c) => c.nombre), 1) : 1;

  return (
    <div>
      <h2>Statistiques d'occupation</h2>
      <form onSubmit={charger}>
        <label>
          Du
          <input type="datetime-local" value={debut} onChange={(e) => setDebut(e.target.value)} required />
        </label>
        <label>
          Au
          <input type="datetime-local" value={fin} onChange={(e) => setFin(e.target.value)} required />
        </label>
        <button type="submit">Calculer</button>
      </form>

      {message && <p>{message}</p>}

      {occupation && (
        <div>
          <h3>Taux d'occupation par salle</h3>
          {occupation.map((s) => (
            <div key={s.salle_id} style={{ marginBottom: 8 }}>
              <div>{s.salle_nom} — {s.taux_occupation}% ({s.heures_reservees}h réservées)</div>
              <div style={{ background: '#eee', height: 10, width: '100%' }}>
                <div style={{ background: '#2e7d32', height: 10, width: `${Math.min(s.taux_occupation, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {creneaux && (
        <div>
          <h3>Créneaux les plus demandés</h3>
          {creneaux.map((c) => (
            <div key={c.creneau} style={{ marginBottom: 8 }}>
              <div>{c.creneau} — {c.nombre} réservation{c.nombre > 1 ? 's' : ''}</div>
              <div style={{ background: '#eee', height: 10, width: '100%' }}>
                <div style={{ background: '#185fa5', height: 10, width: `${(c.nombre / maxCreneau) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatisticsView;