const express = require('express');
const app = express();
const http = require('http');

const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.static(__dirname));

let playerCount = 0;


io.on('connection', socket => {
    console.log('A user connected');
    playerCount++;
    if (playerCount <= 2) {
        socket.emit('playerNumber', playerCount);
    } else {
        socket.emit('message', 'Room is full, try again later.');
        socket.disconnect(true);
    }

    socket.on('disconnect', () => {
        console.log('User disconnected');
        playerCount--;
    });

    socket.on('placePiece', data => {
        socket.broadcast.emit('placePiece', data);
    });

    socket.on('restartGame', () => {
        io.emit('restartGame');
    });
});

app.use(express.static(__dirname + '/public'));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
