const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

const parseGeminiJson = (text) => {
  try {
    const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error('JSON parsing error from Gemini:', err);
    throw new Error('Failed to parse AI response into valid JSON.');
  }
};

router.post('/generate', auth, async (req, res) => {
  const { topic, mode } = req.body;
  const prompt = `Generate a mind map for topic: "${topic}" in mode: "${mode}". Rules: Exactly 5 main branches, each branch 3-4 sub-nodes, labels max 4 words, colors: #6366f1 #ec4899 #f59e0b #10b981 #3b82f6. Return raw JSON only, no markdown, no backticks. Format: {"topic":"","mode":"","children":[{"id":"","label":"","color":"","children":[{"id":"","label":"","children":[]}]}]}`;
  try {
    const result = await model.generateContent(prompt);
    res.json(parseGeminiJson(result.response.text()));
  } catch (err) {
    console.error('Generation Error:', err);
    res.status(500).json({ message: err.message || 'Error generating mindmap' });
  }
});

router.post('/expand', auth, async (req, res) => {
  const { nodeLabel, topic } = req.body;
  const prompt = `Expand mind map node: "${nodeLabel}" from topic: "${topic}". Return raw JSON only: {"id":"${nodeLabel}","label":"${nodeLabel}","children":[{"id":"","label":"","children":[]}]} Give 4-5 children only.`;
  try {
    const result = await model.generateContent(prompt);
    res.json(parseGeminiJson(result.response.text()));
  } catch (err) {
    console.error('Expansion Error:', err);
    res.status(500).json({ message: err.message || 'Error expanding node' });
  }
});

router.post('/chat', auth, async (req, res) => {
  const { nodeLabel, topic, question } = req.body;
  const prompt = `Explain "${nodeLabel}" in context of "${topic}". User question: "${question}". Answer in max 3 clear sentences.`;
  try {
    const result = await model.generateContent(prompt);
    res.json({ answer: result.response.text() });
  } catch (err) {
    console.error('Chat Error:', err);
    res.status(500).json({ message: err.message || 'Error answering question' });
  }
});

router.post('/import', auth, async (req, res) => {
  const { text } = req.body;
  const prompt = `Convert this text into a mind map JSON. Text: "${text}". Return raw JSON only: {"topic":"","mode":"study","children":[{"id":"","label":"","color":"","children":[{"id":"","label":"","children":[]}]}]}`;
  try {
    const result = await model.generateContent(prompt);
    res.json(parseGeminiJson(result.response.text()));
  } catch (err) {
    console.error('Import Error:', err);
    res.status(500).json({ message: err.message || 'Error importing mindmap' });
  }
});

module.exports = router;