const debug = require('debug')('zc:server');
const fs = require('fs');
const https = require('https');

const app = require('./app');
const { web } = require('../config');

const { port, httpsKey, httpsCert } = web;

app.set('port', port);

/**
 * Create HTTPS server.
 */
const options = {
  key: fs.readFileSync(httpsKey, 'utf8'),
  cert: fs.readFileSync(httpsCert, 'utf8'),
};
const server = https.createServer(options, app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
});
