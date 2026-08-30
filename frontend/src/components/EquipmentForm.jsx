import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function EquipmentForm() {
  const { role } = useAuth();
  const [equipements, setEquipements] = useState([]);
  const [nom, setNom] = useState('');
  const [message, setMessage] = useState('');

  function charger() {
    api.get('/equipements').then((res) => setEquipements(res.data));
  }

  useEffect(() => {
    charger();
    const interval = setInterval(charger, 8000);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/equipements', { nom });
      setNom('');
      charger();
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur lors de la création de l'équipement.");
    }
  }

  async function handleSupprimer(id) {
    setMessage('');
    if (!window.confirm('Supprimer définitivement cet équipement ?')) return;
    try {
      await api.delete(`/equipements/${id}`);
      charger();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  }

  return (
    <div>
      <h2>Équipements</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nouvel équipement
          <input value={nom} onChange={(e) => setNom(e.target.value)} required placeholder="ex: Vidéoprojecteur" />
        </label>
        <button type="submit">Ajouter</button>
      </form>
      {message && <p>{message}</p>}
      <ul>
        {equipements.map((eq) => (
          <li key={eq.id}>
            {eq.nom}
            {role === 'admin' && (
              <button onClick={() => handleSupprimer(eq.id)}>Supprimer</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EquipmentForm;
