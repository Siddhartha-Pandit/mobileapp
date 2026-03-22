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
} from 'lucide-react-native';
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
    { href: '/(tabs)/loans', icon: HandCoins, name: 'Loans' },
    { href: '/(tabs)/settings', icon: Settings, name: 'Settings' },
  ] as const;

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
              <Icon color={getIconColor(isActive)} size={24} />
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
});
