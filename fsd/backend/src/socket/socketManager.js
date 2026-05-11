const { Server } = require('socket.io');

const socketManager = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // For development, tighten in production
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join room for specific project chat
    socket.on('join_project', (projectId) => {
      socket.join(projectId);
      console.log(`User ${socket.id} joined project room: ${projectId}`);
    });

    // Handle team messages
    socket.on('send_message', (data) => {
      const { projectId, message } = data;
      io.to(projectId).emit('new_message', message);
    });

    // Handle notifications
    socket.on('send_notification', (data) => {
      const { recipientId, notification } = data;
      socket.to(recipientId).emit('receive_notification', notification);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = socketManager;
