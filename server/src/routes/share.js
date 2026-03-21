const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Map = require('../models/Map');
const { auth } = require('../middleware/auth');

// POST /api/share — generate a public share link for a map
router.post('/', auth, async (req, res) => {
  try {
    const { mapId } = req.body;

    if (!mapId) {
      return res.status(400).json({ error: 'mapId is required' });
    }

    const map = await Map.findOne({ _id: mapId, userId: req.user.id });
    if (!map) {
      return res.status(404).json({ error: 'Map not found' });
    }

    // Generate share ID if not already present
    if (!map.sharedId) {
      map.sharedId = nanoid(12);
      await map.save();
    }

    res.json({ 
      shareId: map.sharedId,
      shareUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/shared/${map.sharedId}`
    });
  } catch (error) {
    console.error('Share error:', error.message);
    res.status(500).json({ error: 'Failed to generate share link' });
  }
});

// GET /api/share/:shareId — fetch a shared map (public)
router.get('/:shareId', async (req, res) => {
  try {
    const map = await Map.findOne({ sharedId: req.params.shareId });
    if (!map) {
      return res.status(404).json({ error: 'Shared map not found' });
    }

    res.json({ 
      map: {
        topic: map.topic,
        mode: map.mode,
        children: map.children,
        createdAt: map.createdAt
      }
    });
  } catch (error) {
    console.error('Fetch shared map error:', error.message);
    res.status(500).json({ error: 'Failed to fetch shared map' });
  }
});

module.exports = router;
