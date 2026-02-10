const EVENTS = require('./events');

/**
 * Socket.io event handlers
 */
class SocketHandlers {
  constructor(io) {
    this.io = io;
    this.onlineUsers = new Map(); // Track online users per project
  }

  /**
   * Handle user joining a project room
   */
  handleJoinProject(socket, data) {
    const { projectId } = data;
    
    if (!projectId) {
      return;
    }

    const roomName = `project_${projectId}`;
    socket.join(roomName);

    // Track user in this project
    if (!this.onlineUsers.has(projectId)) {
      this.onlineUsers.set(projectId, new Set());
    }
    this.onlineUsers.get(projectId).add(socket.userId);

    // Notify other users in the room
    socket.to(roomName).emit(EVENTS.USER_JOINED, {
      userId: socket.userId,
      username: socket.username,
      projectId
    });

    console.log(`User ${socket.username} joined project ${projectId}`);
  }

  /**
   * Handle user leaving a project room
   */
  handleLeaveProject(socket, data) {
    const { projectId } = data;
    
    if (!projectId) {
      return;
    }

    const roomName = `project_${projectId}`;
    socket.leave(roomName);

    // Remove user from project tracking
    if (this.onlineUsers.has(projectId)) {
      this.onlineUsers.get(projectId).delete(socket.userId);
      if (this.onlineUsers.get(projectId).size === 0) {
        this.onlineUsers.delete(projectId);
      }
    }

    // Notify other users in the room
    socket.to(roomName).emit(EVENTS.USER_LEFT, {
      userId: socket.userId,
      projectId
    });

    console.log(`User ${socket.username} left project ${projectId}`);
  }

  /**
   * Handle user disconnect
   */
  handleDisconnect(socket) {
    // Remove user from all projects
    this.onlineUsers.forEach((users, projectId) => {
      if (users.has(socket.userId)) {
        users.delete(socket.userId);
        
        // Notify other users
        this.io.to(`project_${projectId}`).emit(EVENTS.USER_LEFT, {
          userId: socket.userId,
          projectId
        });
        
        if (users.size === 0) {
          this.onlineUsers.delete(projectId);
        }
      }
    });

    console.log(`User ${socket.username} disconnected`);
  }

  /**
   * Get online users for a project
   */
  getOnlineUsers(projectId) {
    return this.onlineUsers.has(projectId) 
      ? Array.from(this.onlineUsers.get(projectId))
      : [];
  }
}

module.exports = SocketHandlers;
