import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/hooks/useTheme';

import { BottomNavBar } from '@/components/BottomNavBar';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      tabBar={() => <BottomNavBar theme={theme} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide index from tab bar as it's a redirect
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
        }}
      />
      <Tabs.Screen
        name="portfolio-list"
        options={{
          title: 'Portfolio',
        }}
      />
      <Tabs.Screen
        name="loans"
        options={{
          title: 'Loans',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
