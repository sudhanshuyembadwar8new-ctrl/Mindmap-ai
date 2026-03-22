require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
console.log('ENV Loading verification:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'Missing');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Loaded' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Missing');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB().catch(() => console.log('DB failed, continuing without DB'));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://mindmap-ai-iota.vercel.app'],
    // Allow requests with no origin (curl, mobile, etc)
    if (!origin) return callback(null, true);
    // Allow any localhost or 127.0.0.1 origin
    if (origin.match(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.url} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/maps', require('./routes/maps'));
app.use('/api', require('./routes/ai'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
}); 
