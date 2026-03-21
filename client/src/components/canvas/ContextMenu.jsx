import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6'];

export default function ContextMenu({ visible, x, y, nodeId, nodeData, onClose, onExpand, onAddChild, onChangeColor, onDelete, onChat }) {
  if (!visible) return null;

  const handleAction = (action) => {
    action();
    onClose();
  };

  return (
    <>
      <div className="context-menu-overlay" onClick={onClose} />
      <AnimatePresence>
        <motion.div
          className="context-menu"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0.85, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.15 }}
        >
          <button
            className="context-menu-item"
            onClick={() => handleAction(() => onExpand(nodeId, nodeData?.label))}
          >
            <span className="context-icon">🧠</span>
            <span>Expand with AI</span>
          </button>

          <button
            className="context-menu-item"
            onClick={() => handleAction(() => onChat(nodeId, nodeData))}
          >
            <span className="context-icon">💬</span>
            <span>Chat about this</span>
          </button>

          <button
            className="context-menu-item"
            onClick={() => handleAction(() => onAddChild(nodeId))}
          >
            <span className="context-icon">➕</span>
            <span>Add child</span>
          </button>

          <div className="context-menu-separator" />

          <div className="context-menu-item color-picker-row">
            <span className="context-icon">🎨</span>
            <div className="color-dots">
              {COLORS.map(color => (
                <button
                  key={color}
                  className="color-dot"
                  style={{ backgroundColor: color }}
                  onClick={() => handleAction(() => onChangeColor(nodeId, color))}
                />
              ))}
            </div>
          </div>

          <div className="context-menu-separator" />

          <button
            className="context-menu-item danger"
            onClick={() => handleAction(() => onDelete(nodeId))}
          >
            <span className="context-icon">🗑️</span>
            <span>Delete node</span>
          </button>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
