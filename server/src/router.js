const { Router } = require('express');
// const path = require('path');
// const joinController = require('./controllers/join');
// const broadcastController = require('./controllers/broadcast');
// const watchController = require('./controllers/watch');
const addressController = require('./controllers/address');

const router = Router();

router
  // .use(express.static(path.join(__dirname, '..', 'public')))
  .get('/address', addressController)
  // .get('/join/broadcaster', joinController.broadcaster)
  // .get('/join/watcher', joinController.watcher)
  // .get('/broadcast', broadcastController)
  // .get('/watch', watchController)

module.exports = router;