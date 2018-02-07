const express = require('./app');
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
let gameData = {};

io.on('connection',(socket) => {
    console.log('New user connected');

    connections[socket.id] = { roomId: null };

    socket.on('join', (room, cb) => {
        if(!isRoomFull(room)) {
            socket.join(room, (err) => {
                if(!err) {
                    connections[socket.id].roomId = room;
                    socket.broadcast.to(room).emit('playerJoined');
                }
            });
            cb(room);
        } else {
            cb('error')
        }            
    });

    socket.on('broadcastMessage', (message) => {
        console.log(`Broadcasting message: ${message}`)

        const room = connections[socket.id].roomId;
        socket.broadcast.to(room).emit('chatMessage', message);
    });

    socket.on('step', ({cellIndex, isCreator}, cb) => {
        console.log(`Broadcasting step: ${cellIndex}`);

        const room = connections[socket.id].roomId;

        if(!gameData[room]) {
            gameData[room] = {
                grid: [
                    0, 0, 0,
                    0, 0, 0,
                    0, 0, 0
                ],
                stepCount: 0
            }
        }

        gameData[room].stepCount = gameData[room].stepCount + 1;
        gameData[room].grid[cellIndex] = isCreator ? 1 : -1;

        console.log(gameData[room].grid);

        if(isWinCondition(gameData[room])) {
            io.in(room).emit('gameOver', {
                result: isCreator ? 'Creator' : 'JoinedUser',
                lastMove: { cellIndex }
            });
        } else if(gameData[room].stepCount === 9){
            io.in(room).emit('gameOver', {
                result: 'Tie',
                lastMove: { cellIndex }
            });
        } else {
            socket.broadcast.to(room).emit('enemyStep', { cellIndex });
        }

        cb();
    })

    socket.on('disconnect', (reason) => {
        console.log('User disconnected. Reason: ', reason);    

        delete connections[socket.id];
    });
});

function isWinCondition({ grid, stepCount }) {
    let winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    return winConditions.some(condition => {
        let summ = condition.reduce((prev, cellIndex) => {
            return prev + grid[cellIndex]
        }, 0);

        return Math.abs(summ) === 3;
    })
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

