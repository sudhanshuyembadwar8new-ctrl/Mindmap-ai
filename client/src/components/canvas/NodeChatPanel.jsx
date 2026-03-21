import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NodeChatPanel({ visible, nodeData, onClose, onChat }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [visible]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (visible && nodeData) {
      setMessages([]);
    }
  }, [nodeData?.label, visible]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const question = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setIsLoading(true);

    try {
      const answer = await onChat(nodeData?.label, question);
      setMessages(prev => [...prev, { role: 'ai', content: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I couldn\'t get a response. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="chat-panel"
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="chat-header">
            <div className="chat-header-info">
              <span className="chat-icon">💬</span>
              <div>
                <h3>AI Chat</h3>
                <p className="chat-node-name">{nodeData?.label || 'Node'}</p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={onClose}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty">
                <span className="chat-empty-icon">🤖</span>
                <p>Ask me anything about <strong>{nodeData?.label}</strong></p>
                <div className="chat-suggestions">
                  {['Explain this concept', 'Give me examples', 'Why is this important?'].map(s => (
                    <button key={s} className="chat-suggestion" onClick={() => {
                      setInputValue(s);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`chat-message ${msg.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="message-content">{msg.content}</div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div
                className="chat-message ai loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              ref={inputRef}
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about ${nodeData?.label || 'this topic'}...`}
              disabled={isLoading}
            />
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
            >
              ↑
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
