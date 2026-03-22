import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Slot } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeProvider';
import SplashScreen from '../components/SplashScreen'; // Corrected import path
import { GlobalLoader } from '../components/GlobalLoader';

// This is a placeholder for your actual authentication logic
const useAuth = () => {
  // For testing purposes, we'll set this to true so the home page is accessible.
  return { isAuthenticated: true };
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
    
    // Auth-only public routes (logged-in users shouldn't see these)
    const authRoutes = new Set([
      'onboarding', 'login', 'signup', 'forgot-password', 'verify-otp', 'reset-password'
    ]);

    if (isAuthenticated && authRoutes.has(segments[0] as string)) {
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated && !inPublicRoute) {
      // Only redirect unauthenticated users away from protected routes
      router.replace('/onboarding' as any);
    }
  }, [isAuthenticated, segments, router, showSplash]);

  return (
    <ThemeProvider>
      {showSplash ? <SplashScreen /> : <Slot />}
      <GlobalLoader />
    </ThemeProvider>
  );
}
