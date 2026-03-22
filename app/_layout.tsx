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
    if (showSplash) return; // Don't run auth logic while splash is showing

    const inTabsGroup = segments[0] === '(tabs)';

    if (isAuthenticated && !inTabsGroup) {
      // If the user is authenticated and not in the main app, redirect them
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated) {
      // If the user is not authenticated, redirect to the onboarding flow
      // The `as any` is a workaround for a TypeScript error where the new route
      // is not yet recognized by the typed routes system.
      router.replace('/onboarding' as any);
    }
  }, [isAuthenticated, segments, router, showSplash]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
