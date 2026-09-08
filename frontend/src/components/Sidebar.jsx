import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/upload', label: 'Upload', icon: '📤' },
  { to: '/quiz', label: 'Quiz', icon: '📝' },
  { to: '/flashcards', label: 'Flashcards', icon: '🗂️' },
  { to: '/study-guide', label: 'Study Guide', icon: '📄' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return children;

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen flex">
      <aside
        style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}
        className="w-64 flex-shrink-0 border-r flex flex-col p-5 hidden md:flex"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            L
          </div>
          <span className="font-bold text-lg">Learn-With-Tech</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={
                location.pathname === link.to
                  ? { background: 'var(--accent)', color: 'white' }
                  : { color: 'var(--text)' }
              }
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors hover:opacity-80"
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={toggleTheme}
          style={{ borderColor: 'var(--border)' }}
          className="mt-4 px-4 py-2 rounded-xl border text-sm font-medium"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          style={{ borderColor: 'var(--border)' }}
          className="mt-2 px-4 py-2 rounded-xl border text-sm font-medium"
        >
          Log Out
        </button>
      </aside>

      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}