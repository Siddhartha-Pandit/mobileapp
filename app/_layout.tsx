import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Slot } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeProvider';
import SplashScreen from '../components/SplashScreen'; // Corrected import path

// This is a placeholder for your actual authentication logic
const useAuth = () => {
  // For now, we'll pretend the user is NOT authenticated to test the onboarding flow.
  // Change this to `true` to test the main authenticated app.
  return { isAuthenticated: false };
};

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showSplash) return;

    const inTabsGroup = segments[0] === '(tabs)';

    // All routes a guest is allowed to visit without being authenticated
    const publicRoutes = new Set([
      'onboarding',
      'login',
      'signup',
      'forgot-password',
      'verify-otp',
      'reset-password',
      'privacy-policy',
      'terms-and-conditions',
      'currency-setup',
      'create-account',
      'expense-category',
      'custom-category',
      'budget-setup',
      'custom-goal',
    ]);
    const inPublicRoute = publicRoutes.has(segments[0] as string);

    if (isAuthenticated && !inTabsGroup) {
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated && !inPublicRoute) {
      // Only redirect unauthenticated users away from protected routes
      router.replace('/onboarding' as any);
    }
  }, [isAuthenticated, segments, router, showSplash]);

  return (
    <ThemeProvider>
      {showSplash ? <SplashScreen /> : <Slot />}
    </ThemeProvider>
  );
}
