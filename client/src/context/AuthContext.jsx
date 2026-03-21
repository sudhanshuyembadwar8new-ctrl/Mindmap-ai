import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mindmap-token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('mindmap-token');
          localStorage.removeItem('mindmap-user');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('mindmap-token', newToken);
    localStorage.setItem('mindmap-user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await api.post('auth/signup', { name, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('mindmap-token', newToken);
    localStorage.setItem('mindmap-user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('mindmap-token');
    localStorage.removeItem('mindmap-user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
