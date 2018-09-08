/*
 * Router of the app
 *
 */

// Dependencies
const router = require('./router').router;
const handlers = require('./handlers');


// Routes
router.get('/ping', handlers.ping);

router.get('/ping/:name/test', handlers.ping);
