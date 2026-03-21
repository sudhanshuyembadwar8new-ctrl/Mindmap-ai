import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="landing-page">
      <nav className="navbar">
        <motion.div 
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          🧠 MindMap AI
        </motion.div>
        <motion.div 
          className="nav-links"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/login" className="nav-link">Log In</Link>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/signup" className="primary-btn sm">Sign Up Free</Link>
          </motion.div>
        </motion.div>
      </nav>

      <main className="hero-section">
        {/* Animated Background Nodes */}
        <div className="floating-bg-elements">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`bg-node bg-node-${i}`}
              animate={{ 
                y: [0, -20, 0], 
                x: [0, i % 2 === 0 ? 15 : -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 6 + i, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.5 
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Think Visually.<br/>
            <span className="gradient-text">Learn Faster.</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle glass-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Generate beautiful AI mind maps in seconds
          </motion.p>
          
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/canvas" className="primary-btn lg glowing-btn">
                Start for Free
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="#features" className="secondary-btn lg">
                See how it works
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className="hero-demo-visual"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, type: "spring", bounce: 0.4 }}
          style={{ y: yBg }}
        >
          <div className="mock-canvas glass-panel">
            <div className="mock-canvas-inner">
              <svg className="mock-edges" width="100%" height="100%" style={{position: 'absolute', inset: 0, zIndex: 1, opacity: 0.5}}>
                {[
                  { x1: "47%", y1: "50%", x2: "28%", y2: "25%", color: "#3b82f6" },
                  { x1: "47%", y1: "50%", x2: "69%", y2: "25%", color: "#10b981" },
                  { x1: "47%", y1: "50%", x2: "69%", y2: "70%", color: "#8b5cf6" },
                  { x1: "47%", y1: "50%", x2: "28%", y2: "70%", color: "#f59e0b" },
                  { x1: "28%", y1: "25%", x2: "10%", y2: "8%", color: "#3b82f6" },
                  { x1: "28%", y1: "25%", x2: "34%", y2: "8%", color: "#3b82f6" },
                  { x1: "28%", y1: "25%", x2: "8%", y2: "28%", color: "#3b82f6" },
                  { x1: "69%", y1: "25%", x2: "80%", y2: "8%", color: "#10b981" },
                  { x1: "69%", y1: "25%", x2: "60%", y2: "8%", color: "#10b981" },
                  { x1: "69%", y1: "70%", x2: "83%", y2: "58%", color: "#8b5cf6" },
                  { x1: "69%", y1: "70%", x2: "85%", y2: "78%", color: "#8b5cf6" },
                  { x1: "69%", y1: "70%", x2: "60%", y2: "88%", color: "#8b5cf6" },
                  { x1: "28%", y1: "70%", x2: "7%", y2: "58%", color: "#f59e0b" },
                  { x1: "28%", y1: "70%", x2: "22%", y2: "83%", color: "#f59e0b" }
                ].map((e, i) => (
                  <motion.line 
                    key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} 
                    stroke={e.color} strokeWidth="2" strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                  />
                ))}
              </svg>
              
              <motion.div className="mock-node root" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} style={{top: '45%', left: '38%'}}>Artificial Intelligence</motion.div>

              <motion.div className="mock-node blue" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.0 }} style={{top: '20%', left: '20%'}}>Machine Learning</motion.div>
              <motion.div className="mock-node blue sm" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.4 }} style={{top: '5%', left: '2%'}}>Neural Networks</motion.div>
              <motion.div className="mock-node blue sm" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }} style={{top: '5%', left: '26%'}}>Deep Learning</motion.div>
              <motion.div className="mock-node blue sm" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6 }} style={{top: '25%', left: '2%'}}>Supervised</motion.div>

              <motion.div className="mock-node green" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1 }} style={{top: '20%', left: '60%'}}>Computer Vision</motion.div>
              <motion.div className="mock-node green sm" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.7 }} style={{top: '5%', left: '72%'}}>Image Recognition</motion.div>
              <motion.div className="mock-node green sm" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8 }} style={{top: '5%', left: '52%'}}>Object Detection</motion.div>

              <motion.div className="mock-node purple" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }} style={{top: '65%', left: '60%'}}>NLP</motion.div>
              <motion.div className="mock-node purple sm" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.9 }} style={{top: '55%', left: '78%'}}>ChatGPT</motion.div>
              <motion.div className="mock-node purple sm" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.0 }} style={{top: '75%', left: '80%'}}>Translation</motion.div>
              <motion.div className="mock-node purple sm" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.1 }} style={{top: '85%', left: '50%'}}>Sentiment</motion.div>

              <motion.div className="mock-node orange" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.3 }} style={{top: '65%', left: '20%'}}>Robotics</motion.div>
              <motion.div className="mock-node orange sm" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2 }} style={{top: '55%', left: '2%'}}>Automation</motion.div>
              <motion.div className="mock-node orange sm" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.3 }} style={{top: '80%', left: '15%'}}>Self Driving</motion.div>
            </div>
          </div>
          <div className="demo-bottom-fade"></div>
        </motion.div>

        <motion.section 
          className="stats-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
        >
          <div className="stat-item">
            <h2>10,000+</h2>
            <p>Maps Created</p>
          </div>
          <div className="stat-item">
            <h2>2M+</h2>
            <p>Ideas Expanded</p>
          </div>
          <div className="stat-item">
            <h2>4.9/5</h2>
            <p>User Rating</p>
          </div>
        </motion.section>

        <motion.section 
          className="features-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="feature-grid">
            <motion.div variants={fadeUpVariant} className="feature-card glass-card">
              <div className="f-icon">⚡</div>
              <h3>Instant Generation</h3>
              <p>Just type a topic and get a fully structured, color-coded mind map in seconds. No drag-and-drop required.</p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="feature-card glass-card">
              <div className="f-icon">🤖</div>
              <h3>Infinite AI Expansion</h3>
              <p>Select any branch and let AI generate deeper sub-topics. Never run out of ideas again.</p>
            </motion.div>
            <motion.div variants={fadeUpVariant} className="feature-card glass-card">
              <div className="f-icon">💬</div>
              <h3>Intelligent Node Chat</h3>
              <p>Ask questions about any specific node and get context-aware answers instantly from our AI assistant.</p>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">🧠 MindMap AI</div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Twitter</a>
            <a href="#">GitHub</a>
          </div>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} MindMap AI. Built for knowledge explorers.</p>
      </footer>
    </div>
  );
}
