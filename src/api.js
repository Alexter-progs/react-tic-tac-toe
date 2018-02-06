import openSocket from 'socket.io-client';

const serverHostURL = `${process.env.REACT_APP_HOST_URL}${process.env.REACT_APP_SERVER_PORT}/`;
const socket = openSocket(serverHostURL);

function onConnect(cb) {
    socket.on('connect', cb);
}

function onPlayerJoined(cb) {
    socket.on('playerJoined', cb);
}

function onChatMessage(cb) {
    socket.on('chatMessage', cb)
}

function onEnemyStep(cb) {
    socket.on('enemyStep', cb);
}

export { onChatMessage, onConnect, onEnemyStep, onPlayerJoined, socket };