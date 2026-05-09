import { create } from 'zustand';
import NetInfo from '@react-native-community/netinfo';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getClientMeta } from '../utils/telemetry';
import { biometrics } from '../utils/biometrics';

// Fallback to localhost if env var is missing
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  avatarUrl?: string;
  occupation?: string;
  gender?: string;
  phone?: string;
}

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  isBiometricEnabled: boolean;
  
  // Actions
  hydrate: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  
  // Biometrics
  updateBiometricStatus: (enabled: boolean) => Promise<void>;
  loginWithBiometrics: () => Promise<void>;
  
  // Profile
  refreshUser: () => Promise<void>;
  updateProfile: (updates: { fullName?: string, avatarUrl?: string, occupation?: string, gender?: string, phone?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrated: false,
  isBiometricEnabled: false,

  hydrate: async () => {
    try {
      // Check biometric status from secure storage
      const bioEnabled = await biometrics.isEnabled();
      set({ isBiometricEnabled: bioEnabled });

      // Try to load user from local database to restore session
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) {
        // Cast to any because the web mock db.select() types broadly as (User | Metric)[]
        const localUser = existingUsers[0] as any;
        if (localUser.accessToken) {
          set({ 
            user: { 
              id: localUser.id.toString(), 
              email: localUser.email, 
              role: 'user', 
              fullName: localUser.name,
              avatarUrl: localUser.avatarUrl || undefined,
              occupation: localUser.occupation || undefined,
              gender: localUser.gender || undefined,
              phone: localUser.phone || undefined,
            },
            accessToken: localUser.accessToken,
            refreshToken: localUser.refreshToken || null,
          });

          // Refresh user data from backend in background
          get().refreshUser().catch(console.error);
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
        name: data.user.fullName,
        email: data.user.email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        avatarUrl: data.user.avatarUrl || null,
        occupation: data.user.occupation || null,
        gender: data.user.gender || null,
        phone: data.user.phone || null,
        synced: true,
      });

      // If biometrics was already enabled, update the stored password in case it changed
      if (get().isBiometricEnabled) {
        await biometrics.saveCredentials(email, password);
      }
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
        name: data.user.fullName,
        email: data.user.email,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        avatarUrl: data.user.avatarUrl || null,
        occupation: data.user.occupation || null,
        gender: data.user.gender || null,
        phone: data.user.phone || null,
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

  updateBiometricStatus: async (enabled: boolean) => {
    try {
      if (enabled) {
        // We need password to enable biometrics securely. 
        // This is usually done after a successful manual login or by asking for password.
        // For now, we'll assume the user is logged in and we can't get the password directly from state.
        // The implementation in settings will handle this by calling biometrics.saveCredentials directly.
        set({ isBiometricEnabled: true });
      } else {
        await biometrics.clearCredentials();
        set({ isBiometricEnabled: false });
      }

      // Update backend
      const token = get().accessToken;
      if (token) {
        await fetch(`${API_URL}/auth/update-settings`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ biometricEnabled: enabled }),
        }).catch(err => console.error('Failed to sync biometric setting to backend', err));
      }
    } catch (e) {
      console.error('Failed to update biometric status', e);
      throw e;
    }
  },

  loginWithBiometrics: async () => {
    const { available, enrolled } = await biometrics.checkAvailability();
    if (!available || !enrolled) {
      throw new Error('Biometrics not available or not set up on this device.');
    }

    const success = await biometrics.authenticate();
    if (!success) {
      throw new Error('Biometric authentication failed.');
    }

    const credentials = await biometrics.getCredentials();
    if (!credentials) {
      throw new Error('No saved credentials found. Please log in manually first.');
    }

    await get().login(credentials.email, credentials.password);
  },

  updateProfile: async (updates) => {
    const userId = get().user?.id;
    if (!userId) return;

    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      // Online update
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${get().accessToken}`
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update profile');
      }
    }

    // Always update locally
    try {
      await db.update(users)
        .set({ 
          name: updates.fullName ?? get().user?.fullName, 
          avatarUrl: updates.avatarUrl ?? get().user?.avatarUrl,
          occupation: updates.occupation ?? get().user?.occupation,
          gender: updates.gender ?? get().user?.gender,
          phone: updates.phone ?? get().user?.phone,
        })
        .where(eq(users.email, get().user?.email || ''));

      set((state) => ({
        user: state.user ? {
          ...state.user,
          ...updates,
        } : null
      }));
    } catch (e) {
      console.error('Failed to update local profile', e);
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('Internet connection required to change password.');
    }

    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${get().accessToken}`
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to change password');
    }

    // If biometrics enabled, update stored credentials
    if (get().isBiometricEnabled && get().user?.email) {
      await biometrics.saveCredentials(get().user!.email, newPassword);
    }
  },

  refreshUser: async () => {
    const accessToken = get().accessToken;
    if (!accessToken) return;

    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) return;

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = data.user;

        // Update local DB
        await db.update(users)
          .set({ 
            name: updatedUser.fullName, 
            avatarUrl: updatedUser.avatarUrl,
            occupation: updatedUser.occupation,
            gender: updatedUser.gender,
            phone: updatedUser.phone,
          })
          .where(eq(users.email, updatedUser.email));

        // Update state
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : updatedUser
        }));
      }
    } catch (e) {
      console.error('Failed to refresh user', e);
    }
  },
}));
