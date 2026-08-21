# 🧠 MindMap AI                     

> **Think Visually. Learn Faster.**                   
> Generate beautiful, interactive AI-powered mind maps instantly.                     

🌐 **Live Demo:** [mindmap-ai-iota.vercel.app](https://mindmap-ai-iota.vercel.app)

---

## 🚀 What is MindMap AI?

MindMap AI is a full-stack AI-powered product that lets you type any topic and instantly generate a beautiful, interactive mind map. Built as a real product — not a student project.

Whether you're a student trying to understand a complex topic, a professional brainstorming ideas, or a creator planning content — MindMap AI turns any topic into a visual, expandable knowledge map in seconds.

---
              
## ✨ Features                                 
                                       
- **AI Generation** — Type any topic, get a full mind map in 2-3 seconds               
- **3 Modes** — Study, Brainstorm, and Plan modes for different use cases                
- **Expand Nodes** — Click any node and AI expands it infinitely deeper                     
- **Node Chat** — Ask AI anything about a specific node                    
- **Import Notes** — Paste text or upload PDF, get an instant mind map                
- **6 Themes** — Dark, Neon, Ocean, Forest, Minimal, Light                  
- **Export** — Download as PNG or PDF
- **Share** — Generate a public share link for any map               
- **Present Mode** — Walk through branches like a presentation                        
- **Save Maps** — All your maps saved to your dashboard
- **Auth System** — Secure signup, login with JWT authentication                             

---                         
              
## 🛠️ Tech Stack                     

| Layer | Technology |
|---|---|
| Frontend | React + Vite + React Flow |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| AI | Google Gemini Flash API |           
| Auth | JWT Tokens |              
| Animations | Framer Motion |
| Deployment | Vercel (frontend) + Render (backend) |                   
                
---

## 🏗️ Architecture
```
User → Vercel (React Frontend)
         ↓
    Render (Node.js Backend)
         ↓
    MongoDB Atlas (Database)                          
         ↓                        
    Gemini Flash API (AI Generation)                      
```                     
                              
---

## 💪 Challenges & How We Solved Them
               
Building this product was not easy. Here's what we faced and how we fought through it:

### 🔴 MongoDB DNS Resolution Failure
**Problem:** MongoDB Atlas SRV DNS records wouldn't resolve on the local network. 3+ hours of debugging.  
**Solution:** Switched DNS to Google (8.8.8.8), installed MongoDB locally as fallback, and used Atlas cloud for production.

### 🔴 Gemini API Quota Limits
**Problem:** Free tier Gemini API quota kept getting exhausted during development and testing, blocking all AI generation.  
**Solution:** Created multiple API keys across Google accounts, switched to `gemini-2.0-flash-lite` model for better free tier limits, and rotated keys strategically.

### 🔴 CORS Blocking on Production
**Problem:** After deploying backend to Render and frontend to Vercel, all API calls were blocked by CORS policy.                     
**Solution:** Updated server CORS config to explicitly allow the Vercel domain alongside localhost origins.          

### 🔴 Environment Variables Not Loading
**Problem:** `dotenv` wasn't finding `.env` file because `index.js` runs from `src/` subfolder, making relative paths wrong.                             
**Solution:** Used `path.resolve(__dirname, '../.env')` to correctly point to the parent directory.                    

### 🔴 Antigravity Token Limits
**Problem:** AI coding assistant token limits ran out mid-build, stopping all progress for days.  
**Solution:** Split work across multiple tools — Claude.ai for architecture and debugging, Antigravity for building, local Ollama for testing. Never stopped building.                

### 🔴 Port Conflicts
**Problem:** Multiple Node.js processes running on same port caused `EADDRINUSE` errors constantly.                                
**Solution:** Used `Get-Process -Name "node" | Stop-Process -Force` to kill all processes before restarting.         
          
### 🔴 Auth Flow Breaking on Live Site  
**Problem:** Login and signup worked locally but failed on production due to API URL mismatch (`localhost` vs `127.0.0.1`).                                    
**Solution:** Standardized all API URLs to use `localhost` and set `VITE_API_URL` environment variable in Vercel pointing to Render backend.                            

---

## ⚠️ Known Issues (Work in Progress)

- 🔄 **AI Generation on free tier** — Gemini free quota resets every 24 hours. If generation fails, quota may be temporarily exhausted.
- 💤 **Backend cold start** — Render free tier spins down after inactivity. First request after sleep takes ~50 seconds to wake up.
- 🗃️ **MongoDB connection** — Occasional Atlas DNS timeouts on certain networks. Falls back gracefully.

---

## 📁 Project Structure
```
mindmap-ai/
├── client/                 # React Frontend
│   └── src/
│       ├── pages/          # Landing, Canvas, Dashboard, Auth
│       ├── components/     # Reusable UI components
│       ├── context/        # Auth, Theme, Toast context
│       ├── hooks/          # Custom React hooks
│       └── utils/          # API configuration
│
└── server/                 # Node.js Backend
    └── src/
        ├── config/         # Database connection
        ├── models/         # User, Map schemas
        ├── middleware/     # JWT auth middleware
        └── routes/         # Auth, Maps, AI endpoints
```

---

## 🔧 Run Locally
```bash
# Clone the repo
git clone https://github.com/sudhanshuyembadwar8-ctrl/mindmap-ai.git

# Backend
cd mindmap-ai/server
npm install
# Create .env with MONGODB_URI, GEMINI_API_KEY, JWT_SECRET, PORT
node src/index.js

# Frontend
cd ../client
npm install
npm run dev
```

---

## 👨‍💻 Built By

**Sudhanshu Mangesh Yembadwar**  
First Year B.Tech — Industrial IoT  
St. Vincent Pallotti College of Engineering, Nagpur

> Built this entire product in one intensive session as a first year engineering student — from zero to a live, deployed, AI-powered web product.

---*

## 🔗 Links

- 🌐 Live App: [mindmap-ai-iota.vercel.app](https://mindmap-ai-iota.vercel.app)
- 💻 GitHub: [github.com/sudhanshuyembadwar8-ctrl/mindmap-ai](https://github.com/sudhanshuyembadwar8-ctrl/mindmap-ai)
- 🤖 Backend API: [mindmap-ai-backend.onrender.com](https://mindmap-ai-backend.onrender.com)

---

⭐ **Star this repo if you found it impressive!**
