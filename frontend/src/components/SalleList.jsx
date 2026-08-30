import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const API_ORIGIN = 'http://localhost:5000';

function SalleList() {
  const { role } = useAuth();
  const [salles, setSalles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState('');

  function charger(estPremierChargement = false) {
    if (estPremierChargement) setChargement(true);
    api.get('/salles')
      .then((res) => setSalles(res.data))
      .catch((err) => console.error(err))
      .finally(() => { if (estPremierChargement) setChargement(false); });
  }

  useEffect(() => {
    charger(true);
    const interval = setInterval(() => charger(false), 8000);
    return () => clearInterval(interval);
  }, []);

  async function handleSupprimer(id) {
    setMessage('');
    if (!window.confirm('Supprimer définitivement cette salle ?')) return;
    try {
      await api.delete(`/salles/${id}`);
      charger();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  }

  if (chargement) return <p>Chargement des salles...</p>;

  return (
    <div className="salle-list">
      <h2>Toutes les salles</h2>
      {message && <p>{message}</p>}
      {salles.map((salle) => (
        <div key={salle.id} className="salle-card">
          {salle.photo_url && (
            <img
              src={`${API_ORIGIN}${salle.photo_url}`}
              alt={`Photo de ${salle.nom}`}
              style={{ maxWidth: 200, display: 'block', margin: '0 auto 8px' }}
            />
          )}
          <h3>{salle.nom}</h3>
          <p>Capacité : {salle.capacite} personnes</p>
          <p>Localisation : {salle.localisation}</p>
          <p>
            Équipements :{' '}
            {salle.Equipements && salle.Equipements.length > 0
              ? salle.Equipements.map((eq) => eq.nom).join(', ')
              : 'aucun'}
          </p>
          {role === 'admin' && (
            <button onClick={() => handleSupprimer(salle.id)}>Supprimer</button>
          )}
        </div>
      ))}
    </div>
  );
}

export default SalleList;
