const { join } = require("path");

/**
 * Keep the downloaded Chrome inside the project folder.
 * This way the Chrome that is installed while building on Render
 * is still there when the server starts.
 */
module.exports = {
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
