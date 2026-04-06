/**
 *  logger-chroma - 🦄 A colorful, developer-friendly Node.js logger with timestamps, emojis, pretty-printed objects, and grouped logs for clear, readable output.
 *  @version: v1.0.9
 *  @link: https://github.com/tutyamxx/logger-chroma
 *  @license: MIT
 **/


// --| CommonJS wrapper for loggerChroma
const esmLogger = require('./index.js');

// --| Export default for require('logger-chroma')
const loggerChroma = esmLogger.default ?? esmLogger;

module.exports = loggerChroma;

// --| Named and default properties for better interop
module.exports.loggerChroma = loggerChroma;
module.exports.default = loggerChroma;
