import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

const MindMapNode = memo(({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation();
    setEditValue(data.label);
    setIsEditing(true);
  }, [data.label]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (editValue.trim() && editValue !== data.label) {
      data.onEditLabel?.(id, editValue.trim());
    }
  }, [editValue, data.label, id, data]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(data.label);
      setIsEditing(false);
    }
  }, [handleBlur, data.label]);

  const isRoot = data.isRoot;
  const depth = data.depth || 0;

  return (
    <motion.div
      className={`mindmap-node ${isRoot ? 'root-node' : ''} ${selected ? 'selected' : ''}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: depth * 0.08 }}
      whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${data.color}40` }}
      onDoubleClick={handleDoubleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        data.onContextMenu?.(e, id, data);
      }}
      style={{
        '--node-accent': data.color,
        borderColor: selected ? data.color : undefined,
      }}
    >
      {!isRoot && (
        <Handle type="target" position={Position.Left} className="node-handle" />
      )}

      <div className="node-color-bar" style={{ backgroundColor: data.color }} />

      {isEditing ? (
        <input
          ref={inputRef}
          className="node-edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          maxLength={50}
        />
      ) : (
        <span className="node-label">{data.label}</span>
      )}

      <Handle type="source" position={Position.Right} className="node-handle" />
    </motion.div>
  );
});

MindMapNode.displayName = 'MindMapNode';
export default MindMapNode;
