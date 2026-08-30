import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SalleList from './components/SalleList';
import AvailabilitySearchForm from './components/AvailabilitySearchForm';
import MesReservations from './components/MesReservations';
import GestionReservations from './components/GestionReservations';
import EquipmentForm from './components/EquipmentForm';
import SalleForm from './components/SalleForm';
import CalendarView from './components/CalendarView';
import Notifications from './components/Notifications';
import StatisticsView from './components/StatisticsView';
import './App.css';

function AppContent() {
  const { token, role, logout } = useAuth();
  const [mode, setMode] = useState('login');

  if (!token) {
    return mode === 'login'
      ? <LoginForm onSwitchToRegister={() => setMode('register')} />
      : <RegisterForm onSwitchToLogin={() => setMode('login')} />;
  }

  const estGestionnaire = ['gestionnaire', 'admin'].includes(role);

  return (
    <div className="app-shell">
      <header>
        <h1>Gestion des salles</h1>
        <p>Connecté en tant que {role} <button onClick={logout}>Se déconnecter</button></p>
      </header>

      <Notifications />
      <AvailabilitySearchForm />
      <CalendarView />
      <MesReservations />
      {estGestionnaire && <GestionReservations />}
      {estGestionnaire && <EquipmentForm />}
      {estGestionnaire && <SalleForm />}
      {estGestionnaire && <StatisticsView />}
      <SalleList />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
