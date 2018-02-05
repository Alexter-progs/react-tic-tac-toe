const app = require('./../../app');
const http = require('http').Server(app);
const dotenv = require('dotenv');
const path = require('path');

const config = dotenv.config({
    path: process.env.NODE_ENV === 'development' ? path.resolve(process.cwd(), '.env.development') : path.resolve(process.cwd(), '.env.production')
});

const PORT = config.parsed.SERVER_PORT || 3001;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

module.exports = http;