import SalleList from './components/SalleList';
import AvailabilitySearchForm from './components/AvailabilitySearchForm';

function App() {
  return (
    <div>
      <h1>Gestion des salles</h1>
      <AvailabilitySearchForm />
      <SalleList />
    </div>
  );
}

export default App;