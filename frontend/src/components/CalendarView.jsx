import { useEffect, useState, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../services/api';

const locales = { fr };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const messages = {
  today: "Aujourd'hui", previous: 'Précédent', next: 'Suivant',
  month: 'Mois', week: 'Semaine', day: 'Jour', agenda: 'Agenda',
  date: 'Date', time: 'Heure', event: 'Événement',
  noEventsInRange: 'Aucune réservation sur cette période',
};

function CalendarView() {
  const [salles, setSalles] = useState([]);
  const [salleId, setSalleId] = useState('');
  const [evenements, setEvenements] = useState([]);
  const [vue, setVue] = useState('month');
  const [dateActuelle, setDateActuelle] = useState(new Date());

  useEffect(() => {
    api.get('/salles').then((res) => setSalles(res.data));
  }, []);

  const chargerEvenements = useCallback((debut, fin) => {
    const params = { debut: debut.toISOString(), fin: fin.toISOString() };
    if (salleId) params.salle_id = salleId;
    api.get('/reservations/calendrier', { params }).then((res) => {
      setEvenements(res.data.map((e) => ({ ...e, start: new Date(e.start), end: new Date(e.end) })));
    });
  }, [salleId]);

  useEffect(() => {
    const debut = new Date(dateActuelle.getFullYear(), dateActuelle.getMonth() - 1, 1);
    const fin = new Date(dateActuelle.getFullYear(), dateActuelle.getMonth() + 2, 0);
    chargerEvenements(debut, fin);
    const interval = setInterval(() => chargerEvenements(debut, fin), 8000);
    return () => clearInterval(interval);
  }, [chargerEvenements, dateActuelle]);

  function styleEvenement(evenement) {
    const couleurs = { en_attente: '#e0a106', confirmee: '#2e7d32', annulee: '#c62828' };
    return { style: { backgroundColor: couleurs[evenement.statut] || '#607d8b' } };
  }

  return (
    <div>
      <h2>Calendrier des réservations</h2>
      <label>
        Filtrer par salle
        <select value={salleId} onChange={(e) => setSalleId(e.target.value)}>
          <option value="">Toutes les salles</option>
          {salles.map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}
        </select>
      </label>

      <div style={{ height: 600, marginTop: 16 }}>
        <Calendar
          localizer={localizer}
          events={evenements}
          startAccessor="start"
          endAccessor="end"
          view={vue}
          onView={setVue}
          views={['month', 'week', 'day']}
          date={dateActuelle}
          onNavigate={setDateActuelle}
          eventPropGetter={styleEvenement}
          messages={messages}
          culture="fr"
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
}

export default CalendarView;
