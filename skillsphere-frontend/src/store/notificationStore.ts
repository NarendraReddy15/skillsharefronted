import { create } from 'zustand';
import { Notification } from '@/types';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (n: Notification[]) => void;
  addNotification: (n: Notification) => void;
  setUnreadCount: (count: number) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    })),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0
    }))
}));
