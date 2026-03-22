require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

console.log('ENV Loading verification:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'Missing');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Loaded' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Missing');

const app = express();

connectDB().catch(() => console.log('DB failed, continuing without DB'));

app.use(cors({
  origin: 'https://mindmap-ai-iota.vercel.app',
  credentials: true
}));

app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/maps', require('./routes/maps'));
app.use('/api', require('./routes/ai'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Running on " + PORT);
});