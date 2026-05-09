import React from 'react';
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  BarChart2,
  Wallet,
  Settings,
  HandCoins,
  Bell
} from 'lucide-react-native';
import { useNotificationStore } from '../src/store/useNotificationStore';
import { Platform } from 'react-native';
import type { AppTheme } from '../constants/theme';

interface Props {
  theme: AppTheme;
}

export const BottomNavBar = ({ theme }: Props) => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  const getIconColor = (isActive: boolean) =>
    isActive ? theme.brandPrimary : theme.textSecondary;

  const tabs = [
    { href: '/(tabs)/home', icon: Home, name: 'Home' },
    { href: '/(tabs)/analytics', icon: BarChart2, name: 'Analytics' },
    { href: '/(tabs)/portfolio-list', icon: Wallet, name: 'Portfolio' },
    { href: '/(tabs)/notifications', icon: Bell, name: 'Notifications', showBadge: true },
    { href: '/(tabs)/settings', icon: Settings, name: 'Settings' },
  ] as const;

  const { unreadCount } = useNotificationStore();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
          maxWidth: windowWidth > 1200 ? 1000 : (windowWidth > 768 ? 900 : (windowWidth > 420 ? 480 : 420)),
        },
      ]}
    >
      {tabs.map((tab) => {
        // Robust matching for Expo Router pathnames which might strip group names
        const isActive = pathname === tab.href || 
                        pathname === tab.href.replace('/(tabs)', '') ||
                        (pathname === '/' && tab.href === '/(tabs)/home');
        const Icon = tab.icon;

        return (
          <Link key={tab.href} href={tab.href as any} asChild>
            <Pressable style={styles.tab}>
              <View>
                <Icon color={getIconColor(isActive)} size={24} />
                {(tab as any).showBadge && unreadCount > 0 && (
                  <View style={[styles.badge, { backgroundColor: '#EF4444' }]}>
                    {unreadCount > 0 && <View style={styles.badgeDot} />}
                  </View>
                )}
              </View>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginHorizontal: 'auto',
    width: '100%',
    elevation: 8,
    boxShadow: '0px -2px 8px rgba(0,0,0,0.1)',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  }
});
