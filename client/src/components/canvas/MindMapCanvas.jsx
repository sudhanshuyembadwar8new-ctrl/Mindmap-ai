import { useState, useCallback, useRef, useEffect } from 'react';
import { ReactFlow, Controls, Background, MiniMap, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import '@xyflow/react/dist/style.css';

import MindMapNode from './MindMapNode';
import ContextMenu from './ContextMenu';
import NodeChatPanel from './NodeChatPanel';
import ModeSelector from './ModeSelector';
import Toolbar from './Toolbar';
import ImportModal from './ImportModal';
import { useMindMap } from '../../hooks/useMindMap';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const nodeTypes = {
  mindMapNode: MindMapNode
};

export default function MindMapCanvas({ initialData = null, isSharedView = false }) {
  const {
    nodes, setNodes, edges, setEdges,
    mapData, mapId, error,
    isGenerating, isExpanding,
    generateMap, expandNode, chatAboutNode,
    editNodeLabel, editNodeColor, removeNode,
    saveMap, loadMap
  } = useMindMap();
  const { addToast } = useToast();

  // Load initial data if provided
  const [hasLoadedInit, setHasLoadedInit] = useState(false);

  const [topicInput, setTopicInput] = useState('');
  const [currentMode, setCurrentMode] = useState('study');
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    if (initialData && !hasLoadedInit) {
      loadMap(initialData, initialData.id);
      setCurrentMode(initialData.mode || 'study');
      setHasLoadedInit(true);
    }
  }, [initialData, hasLoadedInit, loadMap]);

  // Context Menu State
  const [menuState, setMenuState] = useState({ visible: false, x: 0, y: 0, nodeId: null, nodeData: null });
  // Chat Panel State
  const [chatState, setChatState] = useState({ visible: false, nodeData: null });

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = async (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (nodes.length > 0 && !isSharedView) {
          await saveMap(currentMode);
          addToast('Map saved via shortcut!', 'success');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes.length, isSharedView, currentMode, saveMap, addToast]);

  const reactFlowWrapper = useRef(null);

  const onNodesChange = useCallback((changes) => setNodes((nds) => {
    // Handle React Flow internal node state changes (dragging, selecting)
    const newNodes = [...nds];
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        const idx = newNodes.findIndex(n => n.id === change.id);
        if (idx !== -1) newNodes[idx] = { ...newNodes[idx], position: change.position };
      }
      if (change.type === 'select') {
        const idx = newNodes.findIndex(n => n.id === change.id);
        if (idx !== -1) newNodes[idx] = { ...newNodes[idx], selected: change.selected };
      }
    });
    return newNodes;
  }), [setNodes]);

  const onEdgesChange = useCallback((changes) => setEdges((eds) => {
    // Handle React Flow internal edge changes
    const newEdges = [...eds];
    changes.forEach(change => {
      if (change.type === 'select') {
        const idx = newEdges.findIndex(e => e.id === change.id);
        if (idx !== -1) newEdges[idx] = { ...newEdges[idx], selected: change.selected };
      }
    });
    return newEdges;
  }), [setEdges]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Handle Generate
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    try {
      await generateMap(topicInput, currentMode);
      setTopicInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // Node Callbacks passed to MindMapNode
  const onEditLabel = useCallback((id, newLabel) => {
    editNodeLabel(id, newLabel);
  }, [editNodeLabel]);

  const onNodeContextMenu = useCallback((event, id, data) => {
    event.preventDefault();
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    setMenuState({
      visible: true,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      nodeId: id,
      nodeData: data
    });
  }, []);

  const closeMenu = () => setMenuState(prev => ({ ...prev, visible: false }));

  // Menu Actions
  const handleExpand = async (id, label) => {
    try {
      await expandNode(id, label, currentMode);
      addToast('Node expanded successfully!', 'success');
    } catch (err) {
      addToast('Failed to expand node', 'error');
    }
  };

  const handleAddChild = (id) => {
    const parentNode = nodes.find(n => n.id === id);
    if (!parentNode) return;
    
    const newNodeId = `${id}-manual-${Date.now()}`;
    const newChild = {
      id: newNodeId,
      label: 'New Idea',
      color: parentNode.data.color
    };
    
    // Using internal addExpandedChildren logic conceptually
    const depth = (parentNode.data.depth || 0) + 1;
    const newNode = {
      id: newNodeId,
      type: 'mindMapNode',
      position: { x: parentNode.position.x + 220, y: parentNode.position.y },
      data: { label: 'New Idea', color: parentNode.data.color, depth, parentId: id }
    };
    
    const newEdge = {
      id: `edge-${id}-${newNodeId}`,
      source: id,
      target: newNodeId,
      type: 'smoothstep',
      animated: true,
      style: { stroke: parentNode.data.color, strokeWidth: 2, opacity: 0.6 }
    };

    setNodes(nds => [...nds, newNode]);
    setEdges(eds => [...eds, newEdge]);
  };

  const handleChangeColor = (id, color) => editNodeColor(id, color);
  
  const handleDeleteNode = (id) => removeNode(id);

  const handleOpenChat = (id, data) => {
    setChatState({ visible: true, nodeData: data });
  };

  // Attach callbacks to nodes before rendering
  const nodesWithCallbacks = nodes.map(n => ({
    ...n,
    data: {
      ...n.data,
      onEditLabel,
      onContextMenu: onNodeContextMenu
    }
  }));

  return (
    <div className="canvas-container" ref={reactFlowWrapper}>
      {/* Background layer */}
      <div className="canvas-bg-glow"></div>

      {/* Empty State / Generator Form */}
      <AnimatePresence>
        {nodes.length === 0 && !isGenerating && !isSharedView && (
          <motion.div 
            className="empty-state-prompt"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
          >
            <h1>What do you want to mind map?</h1>
            <p className="subtitle">Type a topic and AI will generate a beautiful map instantly.</p>
            
            <form onSubmit={handleGenerate} className="generate-form">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. Machine Learning, Ancient Rome, Space Exploration..."
                autoFocus
              />
              <button type="submit" disabled={!topicInput.trim()} className="generate-btn">
                <span className="sparkle">✨</span> Generate
              </button>
            </form>

            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <span className="subtitle" style={{ margin: 0 }}>OR</span>
              <button className="secondary-btn" onClick={() => setShowImportModal(true)}>
                📥 Import from Notes/PDF
              </button>
            </div>

            <div className="mode-selector-wrapper">
              <span className="mode-label-text">Select Mode:</span>
              <ModeSelector currentMode={currentMode} onModeChange={setCurrentMode} />
            </div>

            {error && <div className="error-toast">{error}</div>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            className="generating-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="generating-pulse">
              <div className="pulse-ring"></div>
              <div className="pulse-core">🧠</div>
            </div>
            <h2>Thinking deeply...</h2>
            <p>Mapping out your topic</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Error Overlay */}
      {error && nodes.length > 0 && (
        <div className="error-toast sticky">{error}</div>
      )}

      {/* Toolbar via Portal / Fixed overlay */}
      {nodes.length > 0 && !isSharedView && (
        <div className="canvas-ui-layer top-right">
          <Toolbar 
            mapTitle={mapData?.topic} 
            mapId={mapId} 
            onSave={async () => {
              await saveMap(currentMode);
              addToast('Map saved successfully!', 'success');
            }} 
            onShare={async () => {
              const res = await api.post('/share', { mapId });
              return res.data;
            }} 
          />
        </div>
      )}

      {/* The actual React Flow Canvas */}
      {nodes.length > 0 && (
        <ReactFlow
          nodes={nodesWithCallbacks}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          onClick={closeMenu}
          onPaneClick={closeMenu}
          proOptions={{ hideAttribution: true }}
          className="mindmap-react-flow"
        >
          <Background variant="dots" gap={24} size={2} color="var(--border)" className="flow-bg" />
          <Controls showInteractive={false} className="flow-controls" style={{ bottom: 20, left: 20 }} />
          <MiniMap 
            nodeColor={(n) => n.data?.color || '#333'} 
            maskColor="rgba(0,0,0,0.2)"
            className="flow-minimap"
            style={{ bottom: 20, right: 20 }}
          />
        </ReactFlow>
      )}

      {/* Floating Menus & Panels */}
      <ContextMenu
        visible={menuState.visible}
        x={menuState.x}
        y={menuState.y}
        nodeId={menuState.nodeId}
        nodeData={menuState.nodeData}
        onClose={closeMenu}
        onExpand={handleExpand}
        onAddChild={handleAddChild}
        onChangeColor={handleChangeColor}
        onDelete={handleDeleteNode}
        onChat={handleOpenChat}
      />

      <NodeChatPanel
        visible={chatState.visible}
        nodeData={chatState.nodeData}
        onClose={() => setChatState({ visible: false, nodeData: null })}
        onChat={(label, question) => chatAboutNode(label, question, currentMode)}
      />

      <ImportModal 
        visible={showImportModal} 
        onClose={() => setShowImportModal(false)}
        onImportSuccess={(data) => loadMap(data, null)}
      />
    </div>
  );
}
