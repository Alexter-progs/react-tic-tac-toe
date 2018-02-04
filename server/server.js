const dotenv = require('dotenv');
const path = require('path');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const morgan = require('morgan')

const config = dotenv.config({
    path: process.env.NODE_ENV === 'development' ? path.resolve(process.cwd(), '.env.development') : path.resolve(process.cwd(), '.env.production')
});

const PORT = config.parsed.SERVER_PORT || 3001;

app.use(morgan('combined'))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
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

module.exports.io = io;