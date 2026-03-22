import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Slot } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeProvider';

// This is a placeholder for your actual authentication logic
const useAuth = () => {
  // For now, we'll just pretend the user is always authenticated.
  // Replace this with your actual authentication check.
  return { isAuthenticated: true }; 
};

export default function RootLayout() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';

    if (isAuthenticated && !inTabsGroup) {
      // If the user is authenticated and not in the main app, redirect them
      router.replace('/(tabs)/home'); 
    } else if (!isAuthenticated && inTabsGroup) {
      // If the user is not authenticated and is trying to access the main app, redirect to login
      router.replace('/login');
    }
  }, [isAuthenticated, segments, router]);

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}
