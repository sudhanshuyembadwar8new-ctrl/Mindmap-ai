const requestHistory = {};

// Clean up old requests every minute
setInterval(() => {
  const now = Date.now();
  Object.keys(requestHistory).forEach(ip => {
    requestHistory[ip] = requestHistory[ip].filter(time => now - time < windowMs);
    if (requestHistory[ip].length === 0) {
      delete requestHistory[ip];
    }
  });
}, 60000);

const windowMs = 15 * 60 * 1000; // 15 minutes
const maxRequests = 20; // 20 requests per 15 minutes

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  
  if (!requestHistory[ip]) {
    requestHistory[ip] = [];
  }

  const now = Date.now();
  requestHistory[ip] = requestHistory[ip].filter(time => now - time < windowMs);

  if (requestHistory[ip].length >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  }

  requestHistory[ip].push(now);
  next();
};

module.exports = rateLimiter;
