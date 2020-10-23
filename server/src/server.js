const express = require('express');
const http = require('http');
const router = require('./router');
const secureConnection = require('./secureConnection');
const startSocket = require('./socket');

const serverPort = 4000;
const server = express();
const httpServer = http.createServer(server);

async function main() {
  secureConnection.setServerPort(serverPort);
  await secureConnection.setup();
  startSocket(httpServer);
  server.use(router);
  httpServer.listen(serverPort, () => console.log(`portal open on port ${serverPort}`));
}

main();
