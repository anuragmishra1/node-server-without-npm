/*
 * Server related tasks
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const routes = require('./routes');
const router = require('./router');

// Instantiate the sever module object
const server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer((req, res) => {
	server.processRequest(req, res);
});

// Instantiate the HTTPS server
server.httpsServerOptions = {
	'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
	'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
	server.processRequest(req, res);
});

// Process all the request
server.processRequest = (req, res) => {

	// Get the URL and parse it
	const parsedUrl = url.parse(req.url, true);

	// Get the path
	const pathname = parsedUrl.pathname.replace(/\/+$/g, '');

	// Get the query string as an object
	const queryStringObject = parsedUrl.query;

	// Get the payload, if any
	let rawData = '';

	req.on('data', (chunk) => {
		rawData += chunk;
	});

	req.on('end', () => {

		try {
			req['body'] = JSON.parse(rawData);
		} catch (e) {
			req['body'] = {};
		}

		req['query'] = queryStringObject;
		req['params'] = {};
		req['path'] = pathname;

		const match = router.match(pathname);

		if (match) {
			const { params, handler } = router.getRouteHandler(pathname);
			req['params'] = params || {};

			// Choose the handler this request have go to
			try {
				handler(req, res);
			} catch(err) {
				res.setHeader('Content-Type', 'application/json');
				res.writeHead(500);
				res.end(JSON.stringify({'error': 'Something went wrong'}));
			}
		} else {
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(404);
			res.end(JSON.stringify({'error': 'Not Found'}));
		}
	});
};

// Init script
server.init = () => {
	// Start the HTTP server, listen on provided port
	server.httpServer.listen(normalizePort(config.httpPort), () => {
        console.log('\x1b[32m%s\x1b[0m', `The server is listening on ${config.httpPort} with ${config.envName} mode`);
    });

	// Bind to the error event for httpServer
	server.httpServer.on('error', (error) => {
		onError(error, config.httpPort);
	});

	// Start the HTTPS server, listen on provided port
	server.httpsServer.listen(normalizePort(config.httpsPort), () => {
        console.log('\x1b[32m%s\x1b[0m', `The server is listening on ${config.httpsPort} with ${config.envName} mode`);
    });

	// Bind to the error event for httpsServer
	server.httpsServer.on('error', (error) => {
		onError(error, config.httpPort);
	});
}

// Normalize a port into a number, string, or false.
var normalizePort = (val) => {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
};

// Event listener for HTTP server "error" event.
var onError = (error, port) => {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof(port) === 'string' ? `Pipe ${port}` : `Port ${port}`;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error('\x1b[31m%s\x1b[0m', `${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error('\x1b[31m%s\x1b[0m', `${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
};

// Export the server
module.exports = server;
