import { useState } from 'react';
import api from '../services/api';

function AvailabilitySearchForm() {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [capaciteMin, setCapaciteMin] = useState('');
  const [resultats, setResultats] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await api.get('/salles/disponibles', {
      params: { date_debut: dateDebut, date_fin: dateFin, capacite_min: capaciteMin || undefined },
    });
    setResultats(res.data);
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

      {resultats && (
        <ul>
          {resultats.map((salle) => (
            <li key={salle.id}>{salle.nom} — {salle.capacite} places</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AvailabilitySearchForm;