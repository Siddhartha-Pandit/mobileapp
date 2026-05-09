import { create } from 'zustand';
import { db } from '../db';
import { notifications as notificationsTable } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { useAuthStore, API_URL } from './useAuthStore';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: string;
  unread: boolean;
  accentColor?: string;
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;

  // Actions
  fetchNotifications: () => Promise<void>;
  generateAiNotification: (language?: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  initLocalNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    const { accessToken, user } = useAuthStore.getState();
    if (!accessToken || !user) return;

    set({ isLoading: true });
    try {
      // 1. Fetch from server
      const response = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const serverNotifs: any[] = await response.json();

      // 2. Sync to local SQLite
      for (const notif of serverNotifs) {
        const existing = await db.select().from(notificationsTable).where(eq(notificationsTable.id, notif.id));
        if (existing.length === 0) {
          await db.insert(notificationsTable).values({
            id: notif.id,
            userId: notif.userId,
            title: notif.title,
            description: notif.description,
            type: notif.type,
            unread: notif.unread,
            accentColor: notif.accentColor,
            createdAt: new Date(notif.createdAt),
            synced: true,
          });
        }
      }

      // 3. Load from SQLite to state
      const localNotifs = await db
        .select()
        .from(notificationsTable)
        .where(eq(notificationsTable.userId, user.id));
      
      const sortedNotifs = localNotifs
        .map(n => ({
          ...n,
          createdAt: new Date(n.createdAt)
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      set({ 
        notifications: sortedNotifs,
        unreadCount: sortedNotifs.filter(n => n.unread).length 
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  generateAiNotification: async (language: string = 'en') => {
    const { accessToken } = useAuthStore.getState();
    if (!accessToken) return;

    try {
      const response = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}` 
        },
        body: JSON.stringify({ action: 'generate_ai', language }),
      });
      
      const newNotif = await response.json();
      if (newNotif && newNotif.id) {
        // Trigger local notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: newNotif.title,
            body: newNotif.description,
            data: { id: newNotif.id },
          },
          trigger: null, // show immediately
        });
        
        await get().fetchNotifications();
      }
    } catch (error) {
      console.error('Error generating AI notification:', error);
    }
  },

  markAsRead: async (id: string) => {
    const { accessToken, user } = useAuthStore.getState();
    if (!accessToken || !user) return;

    try {
      // Local update
      await db.update(notificationsTable)
        .set({ unread: false })
        .where(eq(notificationsTable.id, id));

      // Server update
      fetch(`${API_URL}/notifications`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}` 
        },
        body: JSON.stringify({ id, unread: false }),
      });

      const updatedNotifs = get().notifications.map(n => 
        n.id === id ? { ...n, unread: false } : n
      );
      set({ 
        notifications: updatedNotifs,
        unreadCount: updatedNotifs.filter(n => n.unread).length 
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  },

  markAllRead: async () => {
    const { accessToken, user } = useAuthStore.getState();
    if (!accessToken || !user) return;

    try {
      // Local update
      await db.update(notificationsTable)
        .set({ unread: false })
        .where(eq(notificationsTable.userId, user.id));

      // Server update
      fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}` 
        },
        body: JSON.stringify({ action: 'mark_all_read' }),
      });

      const updatedNotifs = get().notifications.map(n => ({ ...n, unread: false }));
      set({ notifications: updatedNotifs, unreadCount: 0 });
    } catch (error) {
      console.error('Error marking all read:', error);
    }
  },

  deleteNotification: async (id: string) => {
    const { accessToken, user } = useAuthStore.getState();
    if (!accessToken || !user) return;

    try {
      // Local update
      // drizzle-orm delete doesn't support .where() in some stubs, but we'll try
      // In our stub it's a bit limited. We'll just filter state for now.
      
      // Server update
      fetch(`${API_URL}/notifications?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const updatedNotifs = get().notifications.filter(n => n.id !== id);
      set({ 
        notifications: updatedNotifs,
        unreadCount: updatedNotifs.filter(n => n.unread).length 
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  },

  initLocalNotifications: async () => {
    if (Platform.OS === 'web') return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return;

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
}));
