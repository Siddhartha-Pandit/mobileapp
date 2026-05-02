import { create } from 'zustand';
import NetInfo from '@react-native-community/netinfo';
import { db } from '../db';
import { users, metrics } from '../db/schema';
import { eq } from 'drizzle-orm';

interface SyncState {
  isOnline: boolean;
  syncPending: boolean;
  checkNetwork: () => Promise<void>;
  syncData: () => Promise<void>;
}

export const useSyncStore = create<SyncState>((set, get) => ({
  isOnline: false,
  syncPending: false,

  checkNetwork: async () => {
    const state = await NetInfo.fetch();
    set({ isOnline: !!state.isConnected && !!state.isInternetReachable });
  },

  syncData: async () => {
    const { isOnline } = get();
    if (!isOnline) {
      console.log('Offline. Cannot sync.');
      return;
    }

    set({ syncPending: true });

    try {
      // Fetch unsynced data
      const unsyncedMetrics = await db.select().from(metrics).where(eq(metrics.synced, false));

      if (unsyncedMetrics.length === 0) {
        set({ syncPending: false });
        return;
      }

      console.log('Uploading unsynced data...', { unsyncedMetrics });

      // SIMULATE UPLOAD TO CLOUD:
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // After successful upload, mark them as synced
      if (unsyncedMetrics.length > 0) {
        await db.update(metrics).set({ synced: true }).where(eq(metrics.synced, false));
      }

      console.log('Sync successful.');
    } catch (error) {
      console.error('Initial sync error', error);
    } finally {
      set({ syncPending: false });
    }
  },
}));

// Setup automatic network listener
NetInfo.addEventListener(state => {
  useSyncStore.setState({ isOnline: !!state.isConnected && !!state.isInternetReachable });
  // If we just came online, we can trigger sync automatically!
  if (state.isConnected && state.isInternetReachable) {
    useSyncStore.getState().syncData();
  }
});
