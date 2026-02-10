const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const SocketHandlers = require('../socket/handlers');
const EVENTS = require('../socket/events');

/**
 * Initialize Socket.io with the server
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.io instance
 */
const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  const socketHandlers = new SocketHandlers(io);

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user info to socket
      socket.userId = decoded.id;
      socket.email = decoded.email;
      socket.username = decoded.username || decoded.email.split('@')[0];
      
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle connections
  io.on(EVENTS.CONNECTION, (socket) => {
    console.log(`New socket connection: ${socket.id} (User: ${socket.username})`);

    // Handle join project
    socket.on(EVENTS.JOIN_PROJECT, (data) => {
      socketHandlers.handleJoinProject(socket, data);
    });

    // Handle leave project
    socket.on(EVENTS.LEAVE_PROJECT, (data) => {
      socketHandlers.handleLeaveProject(socket, data);
    });

    // Handle disconnect
    socket.on(EVENTS.DISCONNECT, () => {
      socketHandlers.handleDisconnect(socket);
    });
  });

  console.log('Socket.io initialized');

  return io;
};

module.exports = initializeSocket;
