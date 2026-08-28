import { useEffect, useState } from 'react';
import api from '../services/api';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  function charger() {
    api.get('/notifications').then((res) => setNotifications(res.data));
  }

  useEffect(() => { charger(); }, []);

  async function marquerLue(id) {
    await api.patch(`/notifications/${id}/lire`);
    charger();
  }

  const nonLues = notifications.filter((n) => !n.lu).length;

  return (
    <div>
      <h2>Notifications {nonLues > 0 && `(${nonLues} non lue${nonLues > 1 ? 's' : ''})`}</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id} style={{ fontWeight: n.lu ? 'normal' : 'bold' }}>
            {n.message}
            {!n.lu && <button onClick={() => marquerLue(n.id)}>Marquer comme lue</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;