const rateLimit = require("express-rate-limit");

// Set up rate limiting middleware
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 1000, // limit each IP to 10 requests per hour
    message: "Too many requests from this IP, please try again later"
});

module.exports = limiter;