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
import { useTheme } from '@/hooks/useTheme';

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
  title: string;
  date: string;
  amount: number;
  iconKey?: string;
  customIcon?: LucideIcon;
  onPress?: () => void;
}

export const TransactionItem = ({ 
  title, 
  date, 
  amount, 
  iconKey, 
  customIcon: CustomIcon, 
  onPress 
}: Props) => {
  const { theme } = useTheme();
  const isIncome = amount > 0;

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
        },
      ]}
    >
      <View style={styles.leftContent}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: iconBg, borderColor: statusColor },
        ]}>
          <IconToRender color={statusColor} size={22} strokeWidth={2.5} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>{date}</Text>
        </View>
      </View>

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
    boxShadow: '0px 4px 12px rgba(0,0,0,0.02)',
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
    borderRadius: 23,
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
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
