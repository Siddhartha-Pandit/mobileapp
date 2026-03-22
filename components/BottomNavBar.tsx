import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
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

  const getIconColor = (isActive: boolean) =>
    isActive ? theme.brandPrimary : theme.textSecondary;

  const tabs = [
    { href: '/dashboard', icon: Home, name: 'Dashboard' },
    { href: '/analytics', icon: BarChart2, name: 'Analytics' },
    { href: '/portfolio-list', icon: Wallet, name: 'Portfolio' },
    { href: '/loans', icon: HandCoins, name: 'Loans' },
    { href: '/privacy-security', icon: Settings, name: 'Settings' },
  ] as const;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
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
    paddingHorizontal: 16,
    maxWidth: 420,
    alignSelf: 'center',
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
