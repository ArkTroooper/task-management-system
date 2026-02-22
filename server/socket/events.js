// Socket.io event constants
module.exports = {
  // Client to Server
  JOIN_PROJECT: 'join_project',
  LEAVE_PROJECT: 'leave_project',
  
  // Server to Client
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_DELETED: 'task_deleted',
  TASK_MOVED: 'task_moved',
  PROJECT_UPDATED: 'project_updated',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  
  // Connection
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect'
};
