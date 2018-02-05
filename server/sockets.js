const http = require('./bin/www/server');
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    socket.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            socket.emit('timer', new Date());
        }, interval);
    });
});

