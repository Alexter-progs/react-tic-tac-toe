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

let connections = {};

io.on('connection',(socket) => {
    console.log('New user connected');

    connections[socket.id] = { roomId: null };

    socket.on('join', onJoin.bind({ socket }));

    socket.on('broadcastMessage', message => {
        console.log(`Broadcasting message: ${message}`)
        socket.broadcast.to(connections[socket.id].roomId).emit('chatMessage', message);
    })

    socket.on('disconnect', onDisconnect);
});

function onDisconnect(reason) {
    console.log('User disconnected. Reason: ', reason)
}

function onJoin(room, cb) {
    if(!isRoomFull(room)) {
        this.socket.join(room, (err) => {
            if(!err) {
                connections[this.socket.id].roomId = room;
                this.socket.broadcast.to(room).emit('playerJoined');
            }
        });
        cb(room);
    } else {
        cb('error')
    }            
}

function isRoomFull(room) {
    let count = 0;
    for(connection in connections) {
        if(connections[connection].roomId === room) {
            count = count + 1;
        }

        if(count >= 2) {
            return true;
        }
    }

    return false;
}

