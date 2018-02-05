const app = require('express')();
const morgan = require('morgan');
const path = require('path');

app.use(morgan('combined'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;