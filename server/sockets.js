const http = require('./bin/www/server');
const io = require('socket.io')(http);

let Timer = require('./eventHandlers/Timer');

let app = {
    connections: []
}

io.on('connection', (socket) => {
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
});

function onDisconnect() {
    console.log('User disconnected. Reason: ', reason)
}

