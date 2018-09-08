/*
 * Server related tasks
 *
 */

'use strict';

// Dependencies
const server = require('./lib/server');

// Instantiate the server
const app = {};

// Init function
app.init = () => {
	// Start the server
	server.init();
};

// Self invoking only if required directly
if (require.main === module) {
    app.init();
}

// Export the server
module.exports = app;
