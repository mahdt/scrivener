const winston = require('winston');
const express = require('express');
const http = require('http');
const kraken = require('kraken-js');
const path = require('path');
const webpackAssets = require('./middleware/webpackAssets');


/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
const options = {
  onconfig: (config, next) => next(null, config)
};

const app = express();

app.use(kraken(options));
app.on('start', () => {
  winston.info('Application ready to serve requests.');
  winston.info('Environment: %s', app.kraken.get('env:env'));
});

/**
 * Setup webpack assets middleware
 */
app.use(webpackAssets(path.join(__dirname, 'public/site-build/assets.json')));

/*
 * Create and start HTTP server.
 */

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  winston.info('Server listening on', PORT);
});

module.exports = app;
