import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function RegisterForm({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employe');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    try {
      await register(nom, email, password, role);
      setMessage('Compte créé avec succès. Vous pouvez maintenant vous connecter.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la création du compte.');
    }
  }

  return (
    <div>
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nom
          <input value={nom} onChange={(e) => setNom(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Mot de passe
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4} />
        </label>
        <label>
          Rôle
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="employe">Employé</option>
            <option value="gestionnaire">Gestionnaire</option>
            <option value="admin">Administrateur</option>
          </select>
        </label>
        <button type="submit">Créer le compte</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Déjà un compte ?{' '}
        <button type="button" onClick={onSwitchToLogin}>Se connecter</button>
      </p>
    </div>
  );
}

export default RegisterForm;
