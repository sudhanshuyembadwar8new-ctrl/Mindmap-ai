const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimiter = require('../middleware/rateLimiter');
const { generateFromText } = require('../utils/gemini');

// Configure multer for PDF upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and text files are allowed'));
    }
  }
});

// POST /api/import — import text or PDF and generate a mind map
router.post('/', rateLimiter, upload.single('file'), async (req, res) => {
  try {
    let text = '';
    const mode = req.body.mode || 'study';

    if (req.file) {
      // Handle file upload
      if (req.file.mimetype === 'application/pdf') {
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        text = pdfData.text;
      } else {
        text = fs.readFileSync(req.file.path, 'utf-8');
      }

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
    } else if (req.body.text) {
      // Handle text input
      text = req.body.text;
    } else {
      return res.status(400).json({ error: 'Provide either a file or text content' });
    }

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: 'Content too short to generate a map' });
    }

    const mapData = await generateFromText(text.trim(), mode);
    res.json(mapData);
  } catch (error) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Import error:', error.message);
    res.status(500).json({ error: 'Failed to import and generate mind map' });
  }
});

module.exports = router;
