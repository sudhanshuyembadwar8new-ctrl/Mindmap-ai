const express = require('express');
const crypto = require('crypto');
const Map = require('../models/Map');
const auth = require('../middleware/auth');
const router = express.Router();
router.get('/', auth, async (req, res) => {
  const maps = await Map.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(maps);
});
router.get('/:id', auth, async (req, res) => {
  try {
    const map = await Map.findOne({ _id: req.params.id, userId: req.userId });
    if (!map) return res.status(404).json({ message: 'Map not found' });
    res.json(map);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', auth, async (req, res) => {
  try {
    const { title, topic, mode, mapData } = req.body;
    const map = await Map.create({ userId: req.userId, title, topic, mode, mapData });
    res.json(map);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', auth, async (req, res) => {
  await Map.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Deleted' });
});
router.post('/share/:id', auth, async (req, res) => {
  const token = crypto.randomBytes(16).toString('hex');
  const map = await Map.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { shareToken: token, isPublic: true },
    { new: true }
  );
  res.json({ shareToken: token, shareUrl: `/shared/${token}` });
});
router.get('/shared/:token', async (req, res) => {
  const map = await Map.findOne({ shareToken: req.params.token, isPublic: true });
  if (!map) return res.status(404).json({ message: 'Map not found' });
  res.json(map);
});
module.exports = router;
