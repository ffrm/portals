const socketio = require('socket.io');

let broadcaster;

function onSocketConnection(socket) {
  function onBroadcaster() {
    broadcaster = socket.id;
    socket.broadcast.emit('broadcaster');
  }

  function onWatcher() {
    socket.to(broadcaster).emit('watcher', socket.id);
  }

  function onDisconnect() {
    socket.to(broadcaster).emit('disconnectPeer', socket.id);
  }

  function onOffer(id, message) {
    socket.to(id).emit('offer', socket.id, message);
  }

  function onAnswer(id, message) {
    socket.to(id).emit('answer', socket.id, message);
  }

  function onCandidate(id, message) {
    socket.to(id).emit('candidate', socket.id, message);
  }

  socket
    .on('broadcaster', onBroadcaster)
    .on('watcher', onWatcher)
    .on('disconnect', onDisconnect)
    .on('offer', onOffer)
    .on('answer', onAnswer)
    .on('candidate', onCandidate);
}

function onSocketError(error) {
  console.error(error);
}

function startSocket(server) {
  const io = socketio(server);
  io.sockets
    .on('connection', onSocketConnection)
    .on('error', onSocketError);
}

module.exports = startSocket;
