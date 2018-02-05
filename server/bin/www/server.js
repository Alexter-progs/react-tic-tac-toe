const express = require('./../../app');
const http = require('http').Server(express);
const dotenv = require('dotenv');
const path = require('path');
const io = require('socket.io')(http);

const config = dotenv.config({
    path: process.env.NODE_ENV === 'development' ? path.resolve(process.cwd(), '.env.development') : path.resolve(process.cwd(), '.env.production')
});

const PORT = config.parsed.SERVER_PORT || 3001;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

const Timer = require('./../../eventHandlers/Timer');

let app = {
    connections: []
}

io.on('connection',(socket) => {
    let eventHandlers = {
        timer: new Timer(app, socket)
    }

    for (let category in eventHandlers) {
        let handler = eventHandlers[category].handler;
        for (let event in handler) {
            socket.on(event, handler[event]);
        }
    }

    app.connections.push(socket);

    socket.on('disconnect', onDisconnect);
});

function onDisconnect(reason) {
    console.log('User disconnected. Reason: ', reason)
}