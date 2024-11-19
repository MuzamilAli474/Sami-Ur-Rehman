const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('chat message', (msg) => {
        console.log('Message received: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected: ' + socket.id);
    });
});

const PORT = 3001; 
server.listen(PORT, () => {
    console.log(`Socket.IO server is listening on port ${PORT}`);
});
