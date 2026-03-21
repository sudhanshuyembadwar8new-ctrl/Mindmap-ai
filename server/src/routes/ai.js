const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.post('/generate', auth, async (req, res) => {
  const { topic, mode } = req.body;
  console.log(`AI: Generating map for "${topic}" [${mode}]`);
  const prompt = `Generate a mind map for topic: "${topic}" in mode: "${mode}". Rules: Exactly 5 main branches, each branch 3-4 sub-nodes, labels max 4 words, colors: #6366f1 #ec4899 #f59e0b #10b981 #3b82f6. Return raw JSON only, no markdown, no backticks. Format: {"topic":"","mode":"","children":[{"id":"","label":"","color":"","children":[{"id":"","label":"","children":[]}]}]}`;
  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text();
    text = text.replace(/```json|```/g, "").trim();
    console.log(`AI: Received response from Gemini`);
    res.json(JSON.parse(text));
  } catch (err) {
    console.error("AI: Generation error:", err);
    res.status(500).json({ error: err.message });
  }
});
router.post('/expand', auth, async (req, res) => {
  const { nodeLabel, topic } = req.body;
  const prompt = `Expand mind map node: "${nodeLabel}" from topic: "${topic}". Return raw JSON only: {"id":"${nodeLabel}","label":"${nodeLabel}","children":[{"id":"","label":"","children":[]}]} Give 4-5 children only.`;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, '').trim();
    res.json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/chat', auth, async (req, res) => {
  const { nodeLabel, topic, question } = req.body;
  const prompt = `Explain "${nodeLabel}" in context of "${topic}". User question: "${question}". Answer in max 3 clear sentences.`;
  try {
    const result = await model.generateContent(prompt);
    res.json({ answer: result.response.text() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/import', auth, async (req, res) => {
  const { text } = req.body;
  const prompt = `Convert this text into a mind map JSON. Text: "${text}". Return raw JSON only: {"topic":"","mode":"study","children":[{"id":"","label":"","color":"","children":[{"id":"","label":"","children":[]}]}]}`;
  try {
    const result = await model.generateContent(prompt);
    const clean = result.response.text().replace(/```json|```/g, '').trim();
    res.json(JSON.parse(clean));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
