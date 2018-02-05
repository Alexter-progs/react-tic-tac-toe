let Timer = function(app, socket) {
    this.app = app;
    this.socket = socket;

    this.handler = {
        subscribeToTimer : onSubscribeTimer.bind(this)
    }
}

function onSubscribeTimer(interval) {
    console.log('client is subscribing to timer with interval ', interval);

    setInterval(() => {
        this.socket.emit('timer', new Date());
    }, interval);
}

module.exports = Timer;