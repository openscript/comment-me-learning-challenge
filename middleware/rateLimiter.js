// In-memory store for rate limiting per IP
const rateLimiters = new Map();

/**
 * Configuration for the rate limiter middleware.
 */
class RateLimiterConfig {
  /**
   * @param {Object} options
   * @param {number} [options.windowMs=60000] - Time window in ms for rate limiting.
   * @param {number} [options.max=5] - Max requests per window per IP.
   * @param {number} [options.blockMs=300000] - Block duration in ms after repeated violations.
   * @param {number} [options.maxBeforeBlock=2] - Number of windows a user can hit the limit before being blocked.
   */
  constructor({ windowMs = 60000, max = 5, blockMs = 300000, maxBeforeBlock = 2 } = {}) {
    this.windowMs = windowMs;
    this.max = max;
    this.blockMs = blockMs;
    this.maxBeforeBlock = maxBeforeBlock;
  }
}

/**
 * Express middleware for configurable rate limiting and blocking by IP.
 *
 * @param {RateLimiterConfig} config - Configuration object for the rate limiter.
 * @returns {Function} Express middleware function.
 */
function rateLimiter(config) {
  const cfg = config instanceof RateLimiterConfig ? config : new RateLimiterConfig(config);

  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    let entry = rateLimiters.get(ip);

    if (!entry) {
      entry = { count: 1, start: now, blockedUntil: 0, warnCount: 0, warned: false };
      rateLimiters.set(ip, entry);
      return next();
    }

    if (entry.blockedUntil > now) {
      res.status(429).send('Too many requests. You are temporarily blocked.');
      return;
    }

    if (now - entry.start > cfg.windowMs) {
      // Window reset
      entry.count = 1;
      entry.start = now;
      if (entry.warned) {
        entry.warnCount += 1;
        if (entry.warnCount >= cfg.maxBeforeBlock) {
          entry.blockedUntil = now + cfg.blockMs;
          entry.warned = false;
          entry.warnCount = 0;
          res.status(429).send('Too many requests. You are temporarily blocked.');
          return;
        }
      } else {
        entry.warnCount = 0;
      }
      entry.warned = false;
      return next();
    }

    entry.count += 1;
    if (entry.count > cfg.max) {
      if (!entry.warned) {
        entry.warned = true;
        res.status(429).send('Too many requests. Please try again later.');
        return;
      }
      res.status(429).send('Too many requests. Please try again later.');
      return;
    }

    next();
  };
}

export { rateLimiter, RateLimiterConfig };
