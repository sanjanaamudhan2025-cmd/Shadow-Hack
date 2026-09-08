import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', gap: 20 }}>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/upload" style={linkStyle}>Upload</Link>
        <Link to="/profile" style={linkStyle}>Profile</Link>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={toggleTheme} style={btnStyle}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <button onClick={handleLogout} style={btnStyle}>Log Out</button>
      </div>
    </nav>
  );
}

const navStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--card-bg)' };
const linkStyle = { color: 'var(--text)', textDecoration: 'none', fontWeight: 500 };
const btnStyle = { padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' };