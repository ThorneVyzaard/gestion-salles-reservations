import SalleList from './components/SalleList';
import AvailabilitySearchForm from './components/AvailabilitySearchForm';
import MesReservations from './components/MesReservations';
import SalleForm from './components/SalleForm';
import CalendarView from './components/CalendarView';
import Notifications from './components/Notifications';
import StatisticsView from './components/StatisticsView';

function App() {
  return (
    <div>
      <h1>Gestion des salles</h1>
      <Notifications />
      <StatisticsView />
      <AvailabilitySearchForm />
      <CalendarView />
      <MesReservations />
      <SalleForm />
      <SalleList />
    </div>
  );
}

export default App;