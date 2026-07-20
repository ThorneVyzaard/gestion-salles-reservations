import { useEffect, useState } from 'react';
import api from '../services/api';

function SalleList() {
  const [salles, setSalles] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    api.get('/salles')
      .then((res) => setSalles(res.data))
      .catch((err) => console.error(err))
      .finally(() => setChargement(false));
  }, []);

  if (chargement) return <p>Chargement des salles...</p>;

  return (
    <div className="salle-list">
      {salles.map((salle) => (
        <div key={salle.id} className="salle-card">
          <h3>{salle.nom}</h3>
          <p>Capacité : {salle.capacite} personnes</p>
          <p>Localisation : {salle.localisation}</p>
        </div>
      ))}
    </div>
  );
}

export default SalleList;