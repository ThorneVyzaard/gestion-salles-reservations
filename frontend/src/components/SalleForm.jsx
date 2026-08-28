import { useEffect, useState } from 'react';
import api from '../services/api';

function SalleForm() {
  const [nom, setNom] = useState('');
  const [capacite, setCapacite] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [equipementsDisponibles, setEquipementsDisponibles] = useState([]);
  const [equipementsSelectionnes, setEquipementsSelectionnes] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/equipements').then((res) => setEquipementsDisponibles(res.data));
  }, []);

  function toggleEquipement(id) {
    setEquipementsSelectionnes((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/salles', { nom, capacite, localisation });
      const salleId = res.data.id;

      for (const equipementId of equipementsSelectionnes) {
        await api.post(`/salles/${salleId}/equipements`, { equipement_id: equipementId });
      }

      if (photo) {
        const formData = new FormData();
        formData.append('photo', photo);
        await api.post(`/salles/${salleId}/photo`, formData);
      }

      setMessage('Salle créée avec succès.');
      setNom(''); setCapacite(''); setLocalisation(''); setEquipementsSelectionnes([]); setPhoto(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la création de la salle.');
    }
  }

  return (
    <div>
      <h2>Ajouter une salle</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nom
          <input value={nom} onChange={(e) => setNom(e.target.value)} required />
        </label>
        <label>
          Capacité
          <input type="number" value={capacite} onChange={(e) => setCapacite(e.target.value)} required min="1" />
        </label>
        <label>
          Localisation
          <input value={localisation} onChange={(e) => setLocalisation(e.target.value)} />
        </label>

        <fieldset>
          <legend>Équipements</legend>
          {equipementsDisponibles.map((eq) => (
            <label key={eq.id}>
              <input
                type="checkbox"
                checked={equipementsSelectionnes.includes(eq.id)}
                onChange={() => toggleEquipement(eq.id)}
              />
              {eq.nom}
            </label>
          ))}
        </fieldset>

        <label>
          Photo
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPhoto(e.target.files[0])} />
        </label>

        <button type="submit">Créer la salle</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SalleForm;