import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    try {
      login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 400, margin: '80px auto', padding: 32, background: 'var(--card-bg)', borderRadius: 16, border: '1px solid var(--border)' }}
    >
      <h2 style={{ marginBottom: 8 }}>Welcome back</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Log in to continue learning</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
        {error && <p style={{ color: '#ef4444', fontSize: 13 }}>{error}</p>}
        <motion.button whileTap={{ scale: 0.97 }} type="submit" style={btnStyle}>Log In</motion.button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        No account? <Link to="/register" style={{ color: 'var(--accent)' }}>Register</Link>
      </p>
    </motion.div>
  );
}

const inputStyle = { padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' };
const btnStyle = { padding: '10px 12px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 600, cursor: 'pointer' };