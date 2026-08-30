import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginForm({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    try {
      await login(email, password);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur de connexion.');
    }
  }

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Mot de passe
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Se connecter</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Pas encore de compte ?{' '}
        <button type="button" onClick={onSwitchToRegister}>Créer un compte</button>
      </p>
    </div>
  );
}

export default LoginForm;
