/**
 * Convert a mind map JSON tree into React Flow nodes and edges
 * with a radial/hierarchical layout
 */

const NODE_WIDTH = 180;
const NODE_HEIGHT = 50;
const LEVEL_SPACING = 220;
const SIBLING_SPACING = 80;

/**
 * Convert the JSON tree from the API into React Flow nodes/edges
 */
export function jsonToFlow(mapData) {
  if (!mapData || !mapData.children) return { nodes: [], edges: [] };

  const nodes = [];
  const edges = [];

  // Root node
  const rootId = 'root';
  nodes.push({
    id: rootId,
    type: 'mindMapNode',
    position: { x: 0, y: 0 },
    data: {
      label: mapData.topic,
      color: '#6366f1',
      isRoot: true,
      depth: 0
    }
  });

  // Process children recursively
  const processChildren = (children, parentId, depth, parentY, startY) => {
    if (!children || children.length === 0) return startY;

    const totalHeight = children.length * (NODE_HEIGHT + SIBLING_SPACING) - SIBLING_SPACING;
    let currentY = startY - totalHeight / 2;

    children.forEach((child, index) => {
      const nodeId = child.id || `${parentId}-${index}`;
      const x = depth * LEVEL_SPACING;

      nodes.push({
        id: nodeId,
        type: 'mindMapNode',
        position: { x, y: currentY },
        data: {
          label: child.label,
          color: child.color || getColorForDepth(depth),
          depth,
          parentId
        }
      });

      edges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: 'smoothstep',
        animated: depth === 1,
        style: {
          stroke: child.color || getColorForDepth(depth),
          strokeWidth: Math.max(3 - depth, 1),
          opacity: 0.6
        }
      });

      const childStartY = currentY + (NODE_HEIGHT + SIBLING_SPACING) * (child.children?.length || 0) / 2;
      if (child.children && child.children.length > 0) {
        processChildren(child.children, nodeId, depth + 1, currentY, currentY);
      }

      currentY += NODE_HEIGHT + SIBLING_SPACING;
      if (child.children) {
        currentY += (child.children.length - 1) * (NODE_HEIGHT + SIBLING_SPACING) * 0.5;
      }
    });

    return currentY;
  };

  if (mapData.children.length > 0) {
    processChildren(mapData.children, rootId, 1, 0, -(mapData.children.length * (NODE_HEIGHT + SIBLING_SPACING)) / 2);
  }

  return { nodes, edges };
}

/**
 * Add newly expanded children to existing nodes/edges
 */
export function addExpandedChildren(existingNodes, existingEdges, parentId, newChildren, parentNode) {
  const newNodes = [];
  const newEdges = [];

  const parentPos = parentNode?.position || { x: 0, y: 0 };
  const parentDepth = parentNode?.data?.depth ?? 0;
  const childDepth = parentDepth + 1;

  const totalHeight = newChildren.length * (NODE_HEIGHT + SIBLING_SPACING) - SIBLING_SPACING;
  let currentY = parentPos.y - totalHeight / 2;

  newChildren.forEach((child, index) => {
    const nodeId = child.id || `${parentId}-expand-${index}`;
    const x = parentPos.x + LEVEL_SPACING;

    newNodes.push({
      id: nodeId,
      type: 'mindMapNode',
      position: { x, y: currentY },
      data: {
        label: child.label,
        color: child.color || getColorForDepth(childDepth),
        depth: childDepth,
        parentId
      }
    });

    newEdges.push({
      id: `edge-${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: child.color || getColorForDepth(childDepth),
        strokeWidth: Math.max(3 - childDepth, 1),
        opacity: 0.6
      }
    });

    currentY += NODE_HEIGHT + SIBLING_SPACING;
  });

  return {
    nodes: [...existingNodes, ...newNodes],
    edges: [...existingEdges, ...newEdges]
  };
}

const BRANCH_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

function getColorForDepth(depth) {
  if (depth <= 1) return BRANCH_COLORS[0];
  return BRANCH_COLORS[depth % BRANCH_COLORS.length];
}

/**
 * Find a node by ID in the React Flow nodes array
 */
export function findNodeById(nodes, nodeId) {
  return nodes.find(n => n.id === nodeId);
}

/**
 * Update a node's label
 */
export function updateNodeLabel(nodes, nodeId, newLabel) {
  return nodes.map(n =>
    n.id === nodeId
      ? { ...n, data: { ...n.data, label: newLabel } }
      : n
  );
}

/**
 * Update a node's color
 */
export function updateNodeColor(nodes, nodeId, newColor) {
  return nodes.map(n =>
    n.id === nodeId
      ? { ...n, data: { ...n.data, color: newColor } }
      : n
  );
}

/**
 * Delete a node and its descendants
 */
export function deleteNodeAndDescendants(nodes, edges, nodeId) {
  // Find all descendant IDs
  const descendants = new Set();
  const findDescendants = (id) => {
    descendants.add(id);
    edges.forEach(e => {
      if (e.source === id) {
        findDescendants(e.target);
      }
    });
  };
  findDescendants(nodeId);

  return {
    nodes: nodes.filter(n => !descendants.has(n.id)),
    edges: edges.filter(e => !descendants.has(e.source) && !descendants.has(e.target))
  };
}
