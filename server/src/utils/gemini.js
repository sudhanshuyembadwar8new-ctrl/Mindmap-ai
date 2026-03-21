const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a mind map generator. Always return valid JSON only. No explanation, no markdown, no backticks. Just raw JSON.`;

/**
 * Generate a full mind map from a topic
 */
async function generateMap(topic, mode = 'study') {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT
  });

  const prompt = `Generate a mind map for topic: "${topic}" in mode: "${mode}".
Rules:
- Exactly 5 main branches
- Each branch has 3-4 sub-nodes
- Labels max 4 words
- Return format: { "topic": "${topic}", "mode": "${mode}", "children": [{ "id": "node-1", "label": "Branch Label", "color": "#hex", "children": [{ "id": "node-1-1", "label": "Sub Label", "children": [] }] }] }
- Use these colors for main branches: #6366f1 #ec4899 #f59e0b #10b981 #3b82f6
- IDs should follow pattern: node-1, node-1-1, node-1-2, node-2, node-2-1 etc.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  
  // Clean any accidental markdown fencing
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Expand a single node deeper with AI-generated sub-nodes
 */
async function expandNode(nodeLabel, parentPath = '', mode = 'study') {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT
  });

  const context = parentPath ? `Context path: ${parentPath} > ${nodeLabel}` : `Topic: ${nodeLabel}`;

  const prompt = `${context}
Generate 3-4 sub-topics for the mind map node "${nodeLabel}" in ${mode} mode.
Rules:
- Return an array of child nodes
- Labels max 4 words each
- Format: [{ "id": "expand-1", "label": "Sub Topic", "children": [] }, ...]
- Return ONLY the JSON array, nothing else`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Chat with AI about a specific node
 */
async function chatAboutNode(nodeLabel, question, mapTopic = '', mode = 'study') {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    systemInstruction: `You are a knowledgeable tutor. The user is studying a mind map about "${mapTopic}" and asking about the node "${nodeLabel}". Give a clear, concise, helpful answer. Use bullet points when listing things. Keep responses under 200 words.`
  });

  const prompt = `About "${nodeLabel}" in the context of "${mapTopic}" (${mode} mode):
${question}`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

/**
 * Generate a map from imported text content
 */
async function generateFromText(text, mode = 'study') {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT
  });

  // Truncate very long text to avoid token limits
  const truncated = text.length > 5000 ? text.substring(0, 5000) + '...' : text;

  const prompt = `Analyze this text and create a mind map from it in ${mode} mode:

"${truncated}"

Rules:
- Extract the main topic from the text
- Create exactly 5 main branches covering key themes
- Each branch has 3-4 sub-nodes with specific details from the text
- Labels max 4 words
- Return format: { "topic": "Extracted Topic", "mode": "${mode}", "children": [{ "id": "node-1", "label": "Branch Label", "color": "#hex", "children": [{ "id": "node-1-1", "label": "Sub Label", "children": [] }] }] }
- Use these colors for main branches: #6366f1 #ec4899 #f59e0b #10b981 #3b82f6`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text().trim();
  const cleaned = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { generateMap, expandNode, chatAboutNode, generateFromText };
