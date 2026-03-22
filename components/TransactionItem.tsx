import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import {
  ShoppingCart,
  Wallet,
  Zap,
  Utensils,
  Car,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  Music,
  Plus,
  CreditCard,
} from 'lucide-react-native';
import type { AppTheme } from '../constants/theme';

// 1. Map for backend strings to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  shopping: ShoppingCart,
  salary: Wallet,
  utilities: Zap,
  food: Utensils,
  transport: Car,
  mobile: Smartphone,
  entertainment: Music,
  income: Plus,
  transfer: CreditCard,
};

interface Props {
  theme: AppTheme;
  title: string;
  date: string;
  amount: number;
  iconKey?: string;
  customIcon?: LucideIcon;
  onPress?: () => void;
}

export const TransactionItem = ({ 
  theme, 
  title, 
  date, 
  amount, 
  iconKey, 
  customIcon: CustomIcon, 
  onPress 
}: Props) => {
  const isIncome = amount > 0;

  // 2. Logic to determine which icon to display
  const getIcon = (): LucideIcon => {
    if (CustomIcon) return CustomIcon;
    if (iconKey && ICON_MAP[iconKey]) return ICON_MAP[iconKey];

    const t = title.toLowerCase();
    if (t.includes("grocery") || t.includes("market")) return ShoppingCart;
    if (t.includes("salary") || t.includes("paycheck")) return Wallet;
    if (t.includes("electricity") || t.includes("bill") || t.includes("water")) return Zap;
    if (t.includes("pizza") || t.includes("food") || t.includes("restaurant")) return Utensils;
    if (t.includes("uber") || t.includes("ride") || t.includes("taxi")) return Car;
    
    return isIncome ? ArrowDownLeft : ArrowUpRight;
  };

  const IconToRender = getIcon();

  // 3. Dynamic Styling variables
  const statusColor = isIncome ? theme.brandPrimary : '#EF4444';
  const iconBg = isIncome ? `${theme.brandPrimary}15` : '#EF444415';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: `${theme.border}50`,
          shadowColor: '#000', // Added for shadow
        },
      ]}
    >
      <View style={styles.leftContent}>
        {/* Icon Circle Container */}
        <View style={[
          styles.iconContainer,
          { backgroundColor: iconBg, borderColor: statusColor },
        ]}>
          <IconToRender color={statusColor} size={22} strokeWidth={2.5} />
        </View>

        {/* Transaction Text Info */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>{date}</Text>
        </View>
      </View>

      {/* Amount Display */}
      <Text style={[styles.amount, { color: statusColor }]}>
        {isIncome ? '+' : '-'} ₨ {Math.abs(amount).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 10,
    // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 3,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23, // half of width/height
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textContainer: {
    flexDirection: 'column',
    gap: 2,
  },
  title: {
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.3,
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  amount: {
    fontWeight: '800',
    fontSize: 16,
    // React Native doesn't have a universal monospace font by default.
    // On iOS, 'Menlo' or 'Courier' can be used. On Android, 'monospace'.
    // Using a consistent font for numbers usually requires custom font loading.
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
