import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coldStart, setColdStart] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError(null);
    setColdStart(false);
    
    const coldTimer = setTimeout(() => {
      setColdStart(true);
    }, 5000);

    try {
      await login(email, password);
      clearTimeout(coldTimer);
      navigate('/dashboard');
    } catch (err) {
      clearTimeout(coldTimer);
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      clearTimeout(coldTimer);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back-logo">🧠 MindMap AI</Link>
      <motion.div 
        className="auth-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2>Welcome Back</h2>
        <p className="auth-sub">Log in to your account</p>
        
        {error && <div className="auth-error">{error}</div>}
        {coldStart && !error && <div className="auth-info" style={{ color: '#ec4899', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>Connecting to server... (Please wait up to 50s for free tier cold start)</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="primary-btn full">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coldStart, setColdStart] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    
    setLoading(true);
    setError(null);
    setColdStart(false);

    const coldTimer = setTimeout(() => {
      setColdStart(true);
    }, 5000);

    try {
      await signup(name, email, password);
      clearTimeout(coldTimer);
      navigate('/dashboard');
    } catch (err) {
      clearTimeout(coldTimer);
      setError(err.response?.data?.message || 'Failed to sign up');
    } finally {
      clearTimeout(coldTimer);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="auth-back-logo">🧠 MindMap AI</Link>
      <motion.div 
        className="auth-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2>Create Account</h2>
        <p className="auth-sub">Start mapping your brilliant ideas</p>
        
        {error && <div className="auth-error">{error}</div>}
        {coldStart && !error && <div className="auth-info" style={{ color: '#ec4899', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>Connecting to server... (Please wait up to 50s for free tier cold start)</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              placeholder="Jane Doe"
            />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <button type="submit" disabled={loading} className="primary-btn full">
            {loading ? 'Creating account...' : 'Sign Up Free'}
          </button>
        </form>
        
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
