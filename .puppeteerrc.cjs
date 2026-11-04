const { join } = require('path');

/**
 * Keep Chrome inside the project so the build-time download ships with the
 * deploy on Render.
 * @type {import('puppeteer').Configuration}
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
