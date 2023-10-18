// const express = require('express');
// const http = require('http');
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server); 

// io.on('connection', (socket) => {
//   // socket.io logic
// });

// server.listen(5000, () => {
//   console.log('listening on *:5000');
// });
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3001;

// Serve your React app or other static files here
app.use(express.static('public'));
app.get('/', (request, response) => {
  response.send('Hello');
});

// Initialize an empty list of rooms
const rooms = [];

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle creating a room
  socket.on('create-room', (roomName) => {
    // Create a new room object
    const room = { id: socket.id, name: roomName };

    // Add the room to the list of rooms
    rooms.push(room);

    // Notify all clients that a new room has been created
    io.emit('room-created', room);

    // Handle closing a room
    socket.on('close-room', (roomId) => {
      // Remove the room from the list of rooms
      const index = rooms.findIndex((room) => room.id === roomId);
      if (index !== -1) {
        rooms.splice(index, 1);
      }

      // Notify all clients that a room has been closed
      io.emit('room-closed', roomId);
    });

    // Handle adding a chat message
    socket.on('chat-message', (message) => {
      // Broadcast the message to all clients in the room
      io.to(socket.id).emit('chat-message', message);
    });

    // Handle disconnecting from the server
    socket.on('disconnect', () => {
      console.log('A user disconnected');
      // Remove the room if the user created one before disconnecting
      const index = rooms.findIndex((room) => room.id === socket.id);
      if (index !== -1) {
        rooms.splice(index, 1);
        // Notify all clients that the room has been closed
        io.emit('room-closed', socket.id);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
