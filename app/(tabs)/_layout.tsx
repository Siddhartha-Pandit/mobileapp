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
      <Tabs.Screen name="add-expense" options={{ href: null }} />
      <Tabs.Screen name="add-money" options={{ href: null }} />
      <Tabs.Screen name="transfer" options={{ href: null }} />
      <Tabs.Screen name="transaction-detail" options={{ href: null }} />
      <Tabs.Screen name="transactions-list" options={{ href: null }} />
      
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="more" options={{ href: null }} />
      <Tabs.Screen name="budget-breakdown" options={{ href: null }} />
      <Tabs.Screen name="accounts-list" options={{ href: null }} />
      <Tabs.Screen name="account-detail" options={{ href: null }} />
      
      {/* New Pages Request */}
      <Tabs.Screen name="add-account" options={{ href: null }} />
      <Tabs.Screen name="buy-securities" options={{ href: null }} />
      <Tabs.Screen name="sell-securities" options={{ href: null }} />
      <Tabs.Screen name="buy-gold" options={{ href: null }} />
      <Tabs.Screen name="sell-gold" options={{ href: null }} />
      <Tabs.Screen name="screener" options={{ href: null }} />
      <Tabs.Screen name="recurring-transactions" options={{ href: null }} />
      <Tabs.Screen name="recurring-detail" options={{ href: null }} />
      <Tabs.Screen name="add-recurring" options={{ href: null }} />
      <Tabs.Screen name="add-loan" options={{ href: null }} />
      <Tabs.Screen name="loan-detail" options={{ href: null }} />
      <Tabs.Screen name="emi-calc" options={{ href: null }} />
      <Tabs.Screen name="people-list" options={{ href: null }} />
      <Tabs.Screen name="add-people" options={{ href: null }} />
      <Tabs.Screen name="person-detail" options={{ href: null }} />
      <Tabs.Screen name="portfolio-detail" options={{ href: null }} />

      <Tabs.Screen name="manage-security" options={{ href: null }} />
      <Tabs.Screen name="manage-goal" options={{ href: null }} />
      <Tabs.Screen name="manage-currency" options={{ href: null }} />
      <Tabs.Screen name="manage-theme" options={{ href: null }} />
      <Tabs.Screen name="export-data" options={{ href: null }} />
      <Tabs.Screen name="subscriptions" options={{ href: null }} />
      <Tabs.Screen name="manage-categories" options={{ href: null }} />
      <Tabs.Screen name="manage-custom-category" options={{ href: null }} />
    </Tabs>
  );
}
