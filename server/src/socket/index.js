const jwt = require('jsonwebtoken');

const socketHandler = (io) => {
  // Middleware for socket authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.id})`);

    // Join a project room
    socket.on('join:project', (projectId) => {
      socket.join(`project:${projectId}`);
      socket.to(`project:${projectId}`).emit('user:joined', {
        username: socket.user.username,
        userId: socket.user.id
      });
      console.log(`${socket.user.username} joined project ${projectId}`);
    });

    // Leave a project room
    socket.on('leave:project', (projectId) => {
      socket.leave(`project:${projectId}`);
      console.log(`${socket.user.username} left project ${projectId}`);
    });

    // Task created event
    socket.on('task:created', (data) => {
      socket.to(`project:${data.projectId}`).emit('task:created', data.task);
    });

    // Task updated event
    socket.on('task:updated', (data) => {
      socket.to(`project:${data.projectId}`).emit('task:updated', data.task);
    });

    // Task deleted event
    socket.on('task:deleted', (data) => {
      socket.to(`project:${data.projectId}`).emit('task:deleted', data.taskId);
    });

    // Disconnect event
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username} (${socket.id})`);
    });
  });
};

module.exports = socketHandler;
