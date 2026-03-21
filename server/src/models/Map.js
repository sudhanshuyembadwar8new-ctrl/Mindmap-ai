const mongoose = require('mongoose');
const mapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  topic: { type: String, required: true },
  mode: { type: String, default: 'study' },
  mapData: { type: Object, required: true },
  shareToken: { type: String, default: null },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Map', mapSchema);
