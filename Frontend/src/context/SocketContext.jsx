/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

// Create context
export const SocketContext = createContext();

// Provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setReconnectAttempts(0);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('reconnect_attempt', (attempt) => {
      console.log('Reconnection attempt:', attempt);
      setReconnectAttempts(attempt);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('Reconnection failed');
    });

    // Set socket after all event listeners are attached
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Subscribe to an event
  const subscribe = useCallback((event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  }, [socket]);

  // Unsubscribe from an event
  const unsubscribe = useCallback((event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  }, [socket]);

  // Emit an event
  const emit = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  }, [socket, isConnected]);

  // Join a room (e.g., project room)
  const joinRoom = useCallback((room) => {
    if (socket && isConnected) {
      socket.emit('join_room', room);
    }
  }, [socket, isConnected]);

  // Leave a room
  const leaveRoom = useCallback((room) => {
    if (socket && isConnected) {
      socket.emit('leave_room', room);
    }
  }, [socket, isConnected]);

  const value = {
    socket,
    isConnected,
    reconnectAttempts,
    subscribe,
    unsubscribe,
    emit,
    joinRoom,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
