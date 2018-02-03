const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const morgan = require('morgan')

const PORT = process.env.PORT || 3001;

app.use(morgan('combined'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (client) => {
  console.log('a user connected');

  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });
});

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});