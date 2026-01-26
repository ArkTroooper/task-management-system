import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  joinProject(projectId) {
    if (this.socket) {
      this.socket.emit('join:project', projectId);
    }
  }

  leaveProject(projectId) {
    if (this.socket) {
      this.socket.emit('leave:project', projectId);
    }
  }

  emitTaskCreated(projectId, task) {
    if (this.socket) {
      this.socket.emit('task:created', { projectId, task });
    }
  }

  emitTaskUpdated(projectId, task) {
    if (this.socket) {
      this.socket.emit('task:updated', { projectId, task });
    }
  }

  emitTaskDeleted(projectId, taskId) {
    if (this.socket) {
      this.socket.emit('task:deleted', { projectId, taskId });
    }
  }

  onTaskCreated(callback) {
    if (this.socket) {
      this.socket.on('task:created', callback);
    }
  }

  onTaskUpdated(callback) {
    if (this.socket) {
      this.socket.on('task:updated', callback);
    }
  }

  onTaskDeleted(callback) {
    if (this.socket) {
      this.socket.on('task:deleted', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('user:joined', callback);
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default new SocketService();
