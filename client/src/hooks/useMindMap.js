import { useState, useCallback, useRef } from 'react';
import api from '../utils/api';
import { jsonToFlow, addExpandedChildren, updateNodeLabel, updateNodeColor, deleteNodeAndDescendants, findNodeById } from '../utils/mapHelpers';

export function useMindMap() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mapData, setMapData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [error, setError] = useState(null);
  const [mapId, setMapId] = useState(null);

  const generateMap = useCallback(async (topic, mode = 'study') => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await api.post('generate', { topic, mode });
      const data = res.data;
      setMapData(data);
      const { nodes: newNodes, edges: newEdges } = jsonToFlow(data);
      setNodes(newNodes);
      setEdges(newEdges);
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to generate mind map';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const expandNode = useCallback(async (nodeId, nodeLabel, mode = 'study') => {
    setIsExpanding(true);
    setError(null);
    try {
      const res = await api.post('expand', { nodeLabel, mode });
      const newChildren = res.data.children;
      const parentNode = findNodeById(nodes, nodeId);
      const { nodes: updatedNodes, edges: updatedEdges } = addExpandedChildren(
        nodes, edges, nodeId, newChildren, parentNode
      );
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      return newChildren;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to expand node';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsExpanding(false);
    }
  }, [nodes, edges]);

  const chatAboutNode = useCallback(async (nodeLabel, question, mode = 'study') => {
    try {
      const res = await api.post('chat', {
        nodeLabel,
        question,
        mapTopic: mapData?.topic || '',
        mode
      });
      return res.data.answer;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to get response');
    }
  }, [mapData]);

  const editNodeLabel = useCallback((nodeId, newLabel) => {
    setNodes(prev => updateNodeLabel(prev, nodeId, newLabel));
  }, []);

  const editNodeColor = useCallback((nodeId, newColor) => {
    setNodes(prev => updateNodeColor(prev, nodeId, newColor));
  }, []);

  const removeNode = useCallback((nodeId) => {
    const { nodes: updatedNodes, edges: updatedEdges } = deleteNodeAndDescendants(nodes, edges, nodeId);
    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [nodes, edges]);

  const saveMap = useCallback(async (mode = 'study') => {
    if (!mapData) return null;
    try {
      if (mapId) {
        const res = await api.put(`maps/${mapId}`, {
          topic: mapData.topic,
          mode,
          children: mapData.children
        });
        return res.data.map;
      } else {
        const res = await api.post('maps', {
          topic: mapData.topic,
          mode,
          children: mapData.children
        });
        setMapId(res.data.map._id);
        return res.data.map;
      }
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to save map');
    }
  }, [mapData, mapId]);

  const loadMap = useCallback((data, id = null) => {
    setMapData(data);
    setMapId(id);
    const { nodes: newNodes, edges: newEdges } = jsonToFlow(data);
    setNodes(newNodes);
    setEdges(newEdges);
  }, []);

  const clearMap = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setMapData(null);
    setMapId(null);
    setError(null);
  }, []);

  return {
    nodes, setNodes,
    edges, setEdges,
    mapData, mapId,
    isGenerating, isExpanding,
    error,
    generateMap, expandNode, chatAboutNode,
    editNodeLabel, editNodeColor, removeNode,
    saveMap, loadMap, clearMap
  };
}
