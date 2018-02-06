import openSocket from 'socket.io-client';
import { getRoomFromUrl } from './utils/index'

const serverHostURL = `${process.env.REACT_APP_HOST_URL}${process.env.REACT_APP_SERVER_PORT}/`;
const socket = openSocket(serverHostURL);

function joinRoom(cb) {
    let roomId = getRoomFromUrl();
  
    if(roomId.length !== 0) {
      console.log('Joining room');
  
      socket.emit("join", roomId, cb);
    }
}

function onConnect(cb) {
    socket.on('connect', cb);
}

function onPlayerJoined(cb) {
    socket.on('playerJoined', cb);
}

function onChatMessage(cb) {
    socket.on('chatMessage', cb)
}

export { onChatMessage, joinRoom, onConnect, onPlayerJoined, socket };