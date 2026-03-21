import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MindMapCanvas from '../components/canvas/MindMapCanvas';
import api from '../utils/api';
import { useMindMap } from '../hooks/useMindMap';

export default function CanvasPage({ sharedView = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  
  // We extract loadMap & loadData from the hook context to populate saved maps
  // To keep things clean, we'll fetch map data here and pass it down
  // or manage it in the MindMapCanvas via refs. For this scale, a simple 
  // fetch and pass as key/initialData works beautifully.

  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchMap = async () => {
      try {
        const url = sharedView ? `share/${id}` : `maps/${id}`;
        const res = await api.get(url);
        // Reshape API format if needed
        setInitialData({
          id: res.data.map?._id || id,
          topic: res.data.map?.topic,
          mode: res.data.map?.mode,
          children: res.data.map?.children,
          isShared: sharedView
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load map');
        if (!sharedView) {
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMap();
  }, [id, sharedView, navigate]);

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;
  
  if (error) return (
    <div className="error-screen">
      <h2>Oops! {error}</h2>
      <button onClick={() => navigate('/')} className="primary-btn">Go Home</button>
    </div>
  );

  return (
    <div className="canvas-page-wrapper">
      <nav className="canvas-navbar">
        <div className="nav-left" onClick={() => navigate(sharedView ? '/' : '/dashboard')}>
          <span className="back-arrow">←</span> 
          <span className="nav-logo">MindMap AI</span>
        </div>
        {initialData && (
          <div className="map-title-display">
            {initialData.topic}
            {sharedView && <span className="shared-badge-pill">View Only</span>}
          </div>
        )}
      </nav>
      
      {/* We use a key so React destroys/recreates the canvas if the ID changes */}
      <MindMapCanvas 
        key={id || 'new'} 
        initialData={initialData} 
        isSharedView={sharedView} 
      />
    </div>
  );
}
