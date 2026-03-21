import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function DashboardPage() {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    try {
      const res = await api.get('maps');
      setMaps(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setMaps([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this map?')) return;
    try {
      await api.delete(`/maps/${id}`);
      setMaps(maps.filter(m => m._id !== id));
    } catch (err) {
      addToast('Failed to delete map', 'error');
    }
  };

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <Link to="/" className="logo">🧠 MindMap AI</Link>
        <div className="nav-user">
          <div className="user-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
          <span className="user-name">{user?.name}</span>
          <button onClick={logout} className="secondary-btn sm">Log out</button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>Your Mind Maps</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search maps..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border)',
                background: 'var(--bg-elevated)', color: 'var(--text-primary)'
              }}
            />
            <button onClick={() => navigate('/canvas')} className="primary-btn">
              + New Map
            </button>
          </div>
        </div>

        {loading ? (
          <div className="map-grid-skeleton">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card"></div>)}
          </div>
        ) : maps.length === 0 ? (
          <div className="empty-dashboard">
            <div className="empty-icon">🗺️</div>
            <h2>No maps yet</h2>
            <p>Create your first mind map to see it here.</p>
            <button onClick={() => navigate('/canvas')} className="primary-btn">Create Map</button>
          </div>
        ) : (
          <div className="map-grid">
            {maps.filter(map => map.topic.toLowerCase().includes(searchQuery.toLowerCase())).map((map) => (
              <motion.div 
                key={map._id}
                className="map-card"
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}
                onClick={() => navigate(`/canvas/${map._id}`)}
              >
                <div className="map-card-preview bg-grid">
                  <span className="mode-badge">{map.mode}</span>
                  {map.sharedId && <span className="share-badge">🔗 Shared</span>}
                </div>
                <div className="map-card-info">
                  <h3>{map.topic}</h3>
                  <div className="info-row">
                    <span className="date">{new Date(map.updatedAt).toLocaleDateString()}</span>
                    <button 
                      className="delete-card-btn" 
                      onClick={(e) => handleDelete(e, map._id)}
                      title="Delete Map"
                    >🗑️</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
