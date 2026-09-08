import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lwt_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('lwt_user', JSON.stringify(user));
    else localStorage.removeItem('lwt_user');
  }, [user]);

  function register(name, email, password) {
    const users = JSON.parse(localStorage.getItem('lwt_users') || '[]');
    if (users.find(u => u.email === email)) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = { id: Date.now(), name, email, password };
    localStorage.setItem('lwt_users', JSON.stringify([...users, newUser]));
    setUser({ id: newUser.id, name, email });
  }

  function login(email, password) {
    const users = JSON.parse(localStorage.getItem('lwt_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password.');
    setUser({ id: found.id, name: found.name, email: found.email });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);