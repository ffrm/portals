// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const io = require('socket.io-client');
const { getSignalignServerSecureConnectionAddress } = require('../common/signalign');

let socket;
let peerConnection;
let video;

function onBeforeUnload() {
  socket.close();
}

function onLoadedMetadata() {
  video.play();
}

function onOffer(id, description) {
  function onTrack(event) {
    video.srcObject = event.streams[0];
    video.onloadedmetadata = onLoadedMetadata;
  }
  
  function onIceCandidate(event) {
    if (event.candidate) {
      socket.emit('candidate', id, event.candidate);
    }
  }
  
  peerConnection = new RTCPeerConnection();
  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then((sdp) => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit('answer', id, peerConnection.localDescription);
    });
  peerConnection.ontrack = onTrack;
  peerConnection.onicecandidate = onIceCandidate;
}

function onCandidate(id, candidate) {
  peerConnection
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch((error) => console.error(error));
}

function onConnect() {
  socket.emit('watcher');
}

function onBroadcaster() {
  socket.emit('watcher');
}

function onDisconnectPeer() {
  peerConnection.close();
}

function listenSocketEvents() {
  socket
    .on('offer', onOffer)
    .on('candidate', onCandidate)
    .on('connect', onConnect)
    .on('broadcaster', onBroadcaster)
    .on('disconnectPeer', onDisconnectPeer);
}

async function main() {
  video = document.querySelector('video');
  signalignServerHttpsAddress = await getSignalignServerSecureConnectionAddress();
  socket = io.connect(signalignServerHttpsAddress);
  listenSocketEvents();
}

document.addEventListener('DOMContentLoaded', main);
window.onunload = window.onbeforeunload = onBeforeUnload;