/*
 * Request handlers
 *
 */

// Dependencies
const config = require('../config');

// Define the handlers
const handlers = {};

/*
 * JSON API Handlers
 *
 */

// Ping handler
handlers.ping = (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.end();
};

// Export the module
module.exports = handlers;
