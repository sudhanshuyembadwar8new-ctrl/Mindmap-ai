import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import ThemeSwitcher from './ThemeSwitcher';
import { useReactFlow } from '@xyflow/react';
import { useToast } from '../../context/ToastContext';

export default function Toolbar({ mapTitle, onSave, onShare, mapId }) {
  const [isExporting, setIsExporting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const { getNodes, getNodesBounds, fitView } = useReactFlow();
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);
  const { addToast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setExportOpen(false);
      }
    };
    if (exportOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [exportOpen]);

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      const nodesBounds = getNodesBounds(getNodes());
      const transform = [
        1000 / (nodesBounds.width + 100), // padding
        200 / (nodesBounds.height + 100)
      ];

      const viewport = document.querySelector('.react-flow__viewport');
      const canvas = document.querySelector('.react-flow');

      // Add a clean background for export
      const bgStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-canvas');
      
      const dataUrl = await toPng(viewport, {
        backgroundColor: bgStyle,
        width: nodesBounds.width + 100,
        height: nodesBounds.height + 100,
        style: {
          width: '100%',
          height: '100%',
          transform: `translate(${-nodesBounds.x + 50}px, ${-nodesBounds.y + 50}px) scale(1)`
        }
      });

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `${mapTitle || 'mindmap'}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: nodesBounds.width > nodesBounds.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [nodesBounds.width + 100, nodesBounds.height + 100]
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, nodesBounds.width + 100, nodesBounds.height + 100);
        pdf.save(`${mapTitle || 'mindmap'}.pdf`);
      }
    } catch (err) {
      console.error('Export failed:', err);
      addToast('Failed to export map', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!mapId) {
      addToast('Please save the map first before sharing!', 'info');
      return;
    }
    
    try {
      const res = await onShare();
      setShareLink(res.shareUrl);
      setShowShareModal(true);
      addToast('Share link generated!', 'success');
    } catch (err) {
      addToast('Failed to generate share link', 'error');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    addToast('Link copied to clipboard!', 'success', 2000);
    setShowShareModal(false);
  };

  const handlePresent = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        addToast('Error attempting to enable fullscreen', 'error');
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      <div className="canvas-toolbar">
        <div className="toolbar-group">
          <ThemeSwitcher />
          <motion.button 
            className="icon-btn tool-btn" 
            onClick={handlePresent}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Present Fullscreen"
          >
            📺 <span className="btn-label">Present</span>
          </motion.button>
        </div>
        
        <div className="toolbar-divider" />
        
        <div className="toolbar-group">
          <motion.button 
            className="icon-btn tool-btn" 
            onClick={() => onSave()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Save Map"
          >
            💾 <span className="btn-label">Save</span>
          </motion.button>
          
          <motion.button 
            className="icon-btn tool-btn" 
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Share Link"
          >
            🔗 <span className="btn-label">Share</span>
          </motion.button>
        </div>

        <div className="toolbar-divider" />

        <div className="toolbar-group">
          <div className="export-dropdown-wrapper" ref={exportRef}>
            <motion.button 
              className="icon-btn tool-btn export-btn"
              onClick={() => setExportOpen(!exportOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isExporting}
            >
              {isExporting ? '⌛' : '📥'} <span className="btn-label">Export</span>
            </motion.button>
            <AnimatePresence>
              {exportOpen && (
                <motion.div 
                  className="export-dropdown menu-panel"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <button onClick={() => { handleExport('png'); setExportOpen(false); }}>As PNG Image</button>
                  <button onClick={() => { handleExport('pdf'); setExportOpen(false); }}>As PDF Document</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showShareModal && (
          <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <h3>Share Map 🎉</h3>
              <p>Anyone with this link can view your mind map.</p>
              <div className="share-link-box">
                <input type="text" readOnly value={shareLink} />
                <button onClick={copyLink} className="primary-btn sm">Copy</button>
              </div>
              <button 
                className="close-modal-btn" 
                onClick={() => setShowShareModal(false)}
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
