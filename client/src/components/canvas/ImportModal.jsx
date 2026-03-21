import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function ImportModal({ visible, onClose, onImportSuccess }) {
  const [activeTab, setActiveTab] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const { addToast } = useToast();

  const handleImport = async () => {
    setIsImporting(true);
    try {
      if (activeTab === 'text') {
        if (!textContent.trim()) {
          addToast('Please enter some text', 'error');
          return;
        }
        const res = await api.post('/import', { text: textContent });
        onImportSuccess(res.data.mapData);
        addToast('Map generated successfully from text!', 'success');
      } else {
        if (!file) {
          addToast('Please select a PDF file', 'error');
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/import', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        onImportSuccess(res.data.mapData);
        addToast('Map generated successfully from PDF!', 'success');
      }
      onClose();
    } catch (err) {
      console.error(err);
      addToast(err?.response?.data?.error || 'Failed to import document', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div 
            className="modal-content import-modal"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '600px', width: '90%' }}
          >
            <h2>Import Content</h2>
            <p className="auth-sub" style={{ marginBottom: '1rem' }}>Generate a mind map from existing notes or documents.</p>
            
            <div className="import-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', background: 'var(--bg-primary)', padding: '4px', borderRadius: '10px' }}>
              <button 
                className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
                onClick={() => setActiveTab('text')}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', background: activeTab === 'text' ? 'var(--bg-elevated)' : 'transparent', color: activeTab === 'text' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                Paste Text
              </button>
              <button 
                className={`tab-btn ${activeTab === 'pdf' ? 'active' : ''}`}
                onClick={() => setActiveTab('pdf')}
                style={{ flex: 1, padding: '8px', borderRadius: '8px', background: activeTab === 'pdf' ? 'var(--bg-elevated)' : 'transparent', color: activeTab === 'pdf' ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                Upload PDF
              </button>
            </div>

            {activeTab === 'text' ? (
              <textarea 
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste your notes, essay, or raw text here..."
                style={{ width: '100%', height: '150px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', resize: 'none', marginBottom: '1rem' }}
              />
            ) : (
              <div 
                className="file-drop-area"
                style={{ width: '100%', height: '150px', border: '2px dashed var(--border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: 'var(--bg-primary)' }}
              >
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: 'none' }}
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📄</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Click to select a PDF</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {file ? file.name : 'Max 5MB recommended'}
                  </div>
                </label>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="secondary-btn" onClick={onClose} disabled={isImporting}>Cancel</button>
              <button className="primary-btn" onClick={handleImport} disabled={isImporting}>
                {isImporting ? 'Generating...' : 'Generate Map'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
