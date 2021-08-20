const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: '*'
});
const redis = require('socket.io-redis');

io.adapter(redis({ host: 'localhost', port: 6379 }));

io.on('connection', socket => {
  socket.on('ping', data => {
    socket.broadcast.emit('pong', data); // 나를 제외한 모든 소켓에게 이벤트 발생
  })
})

server.listen(3001);