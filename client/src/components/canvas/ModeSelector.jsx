import { motion } from 'framer-motion';

const MODES = [
  { id: 'study', label: 'Study', icon: '📚', description: 'Academic & structured' },
  { id: 'brainstorm', label: 'Brainstorm', icon: '💡', description: 'Creative & exploratory' },
  { id: 'plan', label: 'Plan', icon: '📋', description: 'Actionable & organized' }
];

export default function ModeSelector({ currentMode, onModeChange }) {
  return (
    <div className="mode-selector">
      {MODES.map(mode => (
        <motion.button
          key={mode.id}
          className={`mode-btn ${currentMode === mode.id ? 'active' : ''}`}
          onClick={() => onModeChange(mode.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={mode.description}
        >
          <span className="mode-icon">{mode.icon}</span>
          <span className="mode-label">{mode.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
