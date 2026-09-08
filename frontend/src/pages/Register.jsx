import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    try {
      register(name, email, password);
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
      <h2 style={{ marginBottom: 8 }}>Create an account</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Start your learning journey</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
        {error && <p style={{ color: '#ef4444', fontSize: 13 }}>{error}</p>}
        <motion.button whileTap={{ scale: 0.97 }} type="submit" style={btnStyle}>Register</motion.button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Log In</Link>
      </p>
    </motion.div>
  );
}

const inputStyle = { padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' };
const btnStyle = { padding: '10px 12px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: 'white', fontWeight: 600, cursor: 'pointer' };