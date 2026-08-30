import { useEffect, useState } from 'react';
import api from '../services/api';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');

  function charger() {
    api.get('/notifications').then((res) => setNotifications(res.data));
  }

  useEffect(() => {
    charger();
    const interval = setInterval(charger, 8000);
    return () => clearInterval(interval);
  }, []);

  async function marquerLue(id) {
    await api.patch(`/notifications/${id}/lire`);
    charger();
  }

  async function handleSupprimer(id) {
    setMessage('');
    try {
      await api.delete(`/notifications/${id}`);
      charger();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  }

  async function handleToutSupprimer() {
    if (!window.confirm('Supprimer toutes vos notifications ?')) return;
    setMessage('');
    try {
      await api.delete('/notifications');
      charger();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  }

  const nonLues = notifications.filter((n) => !n.lu).length;

  return (
    <div>
      <h2>Notifications {nonLues > 0 && `(${nonLues} non lue${nonLues > 1 ? 's' : ''})`}</h2>
      {message && <p>{message}</p>}
      {notifications.length > 0 && (
        <button onClick={handleToutSupprimer}>Tout supprimer</button>
      )}
      <ul>
        {notifications.map((n) => (
          <li key={n.id} style={{ fontWeight: n.lu ? 'normal' : 'bold' }}>
            {n.message}
            {!n.lu && <button onClick={() => marquerLue(n.id)}>Marquer comme lue</button>}
            <button onClick={() => handleSupprimer(n.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
