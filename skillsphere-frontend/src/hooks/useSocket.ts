import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

let socketInstance: Socket | null = null;

export const useSocket = () => {
  const { token, isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !token || initialized.current) return;
    initialized.current = true;

    socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket']
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
    });

    socketInstance.on('notification', (data) => {
      addNotification(data);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socketInstance?.disconnect();
      socketInstance = null;
      initialized.current = false;
    };
  }, [isAuthenticated, token]);

  return socketInstance;
};

export const getSocket = () => socketInstance;
