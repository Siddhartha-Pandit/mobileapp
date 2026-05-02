import { create } from 'zustand';
import NetInfo from '@react-native-community/netinfo';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getClientMeta } from '../utils/telemetry';

// Fallback to localhost if env var is missing
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  fullName?: string;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  
  // Actions
  hydrate: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrated: false,

  hydrate: async () => {
    try {
      // Try to load user from local database to restore session
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) {
        // Cast to any because the web mock db.select() types broadly as (User | Metric)[]
        const localUser = existingUsers[0] as any;
        if (localUser.accessToken) {
          set({ 
            user: { id: localUser.id.toString(), email: localUser.email, role: 'user', fullName: localUser.name },
            accessToken: localUser.accessToken,
            refreshToken: localUser.refreshToken || null,
          });
        }
      }
    } catch (e) {
      console.error('Failed to hydrate auth state', e);
    } finally {
      set({ isHydrated: true });
    }
  },

  setTokens: async (accessToken: string, refreshToken: string) => {
    try {
        await db.update(users).set({ accessToken, refreshToken });
    } catch(e) {
        console.error('Failed to update tokens locally', e);
    }
    set({ accessToken, refreshToken });
  },

  login: async (email, password) => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('Internet connection required to log in.');
    }

    const meta = await getClientMeta();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, ...meta }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Login failed');
    }

    const data = await response.json();
    
    // Save to local DB for session persistence
    try {
      // Clear previous users so we only have one active session locally
      await db.delete(users); 
      await db.insert(users).values({
        name: data.user.fullName || data.user.email.split('@')[0], // Next.js returns basic user info, adjust as needed
        email: data.user.email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        synced: true,
      });
    } catch (e) {
      console.error('Failed to save session locally', e);
    }

    set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
  },

  signup: async (fullName, email, password) => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('Internet connection required to sign up.');
    }

    const meta = await getClientMeta();

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, ...meta }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Registration failed');
    }

    // Do NOT set tokens here. User must verify OTP first!
  },

  verifyOtp: async (email: string, otp: string) => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('Internet connection required to verify OTP.');
    }

    const meta = await getClientMeta();

    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, ...meta }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'OTP Verification failed');
    }

    const data = await response.json();

    try {
      // Clear previous users
      await db.delete(users);
      await db.insert(users).values({
        name: data.user.fullName || data.user.email.split('@')[0],
        email: data.user.email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        synced: true,
      });
    } catch (e) {
      console.error('Failed to save session locally', e);
    }

    set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
  },

  resendOtp: async (email: string) => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('Internet connection required.');
    }

    const response = await fetch(`${API_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to resend OTP');
    }
  },

  logout: async () => {
    try {
      const token = get().refreshToken;
      if (token) {
          try {
              await fetch(`${API_URL}/auth/logout`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ refreshToken: token }), 
              }).catch(() => {});
          } catch(e) {}
      }

      await db.delete(users);
    } catch (e) {
      console.error('Failed to clear local session', e);
    }
    set({ user: null, accessToken: null, refreshToken: null });
  },

  logoutAll: async () => {
    try {
      const userId = get().user?.id;
      if (userId) {
          try {
              await fetch(`${API_URL}/auth/logout-all`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId }), 
              }).catch(() => {});
          } catch(e) {}
      }

      await db.delete(users);
    } catch (e) {
      console.error('Failed to clear local session', e);
    }
    set({ user: null, accessToken: null, refreshToken: null });
  },
}));
