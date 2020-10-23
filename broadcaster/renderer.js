// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { desktopCapturer } = require('electron');
const io = require('socket.io-client');
const { getSignalignServerSecureConnectionAddress } = require('../common/signalign');

let signalignServerHttpsAddress;
let peerConnections = {};
let socket;
let stream;

const constraints = {
  video: true,
  audio: false,
};

async function showStreamingOptions() {
  const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
  const source = sources.find(({ name }) => /entire screen/i.test(name));
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
        // minWidth: 1280,
        // maxWidth: 1280,
        // minHeight: 720,
        // maxHeight: 720,
      }
    }
  });
  document.querySelector('video').srcObject = stream;
  onStreamingStarted(stream);
}

function onBroadcaster() {
  socket.emit('broadcaster');
}

function onWatcher(id) {
  function onIceCandidate(event) {
    if (event.candidate) {
      socket.emit('candidate', id, event.candidate);
    }
  }

  const peerConnection = new RTCPeerConnection();
  peerConnections[id] = peerConnection;
  stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
  peerConnection.onicecandidate = onIceCandidate;
  peerConnection
    .createOffer()
    .then((sdp) => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit('offer', id, peerConnection.localDescription);
    })
}

function onAnswer(id, description) {
  peerConnections[id].setRemoteDescription(description);
}

function onCandidate(id, candidate) {
  peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
}

function onDisconnectPeer(id) {
  peerConnections[id].close();
  delete peerConnections[id];
}

function onStreamingStarted(stream) {
  onBroadcaster();
}

function onBeforeUnload() {
  socket.close();
}

function listenSocketEvents() {
  socket
    .on('watcher', onWatcher)
    .on('answer', onAnswer)
    .on('candidate', onCandidate)
    .on('disconnectPeer', onDisconnectPeer);
}

async function main() {
  document.querySelector('button').onclick = (event) => showStreamingOptions();
  signalignServerHttpsAddress = await getSignalignServerSecureConnectionAddress();
  const title = document.querySelector('h1');
  title.textContent = signalignServerHttpsAddress;
  showStreamingOptions();
  socket = io.connect(signalignServerHttpsAddress);
  listenSocketEvents();
}

document.addEventListener('DOMContentLoaded', main);
window.onunload = window.onbeforeunload = onBeforeUnload;
