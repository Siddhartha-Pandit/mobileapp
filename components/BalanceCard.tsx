import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TrendingUp, Eye, EyeOff } from 'lucide-react-native';
import type { AppTheme } from '../constants/theme';

interface Props {
  theme: AppTheme;
  balance: number;
}

export const BalanceCard = ({ theme, balance }: Props) => {
  const [showBalance, setShowBalance] = React.useState(true);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Total Balance</Text>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)} style={styles.eyeBtn}>
            {showBalance ? <Eye size={16} color={theme.textSecondary} /> : <EyeOff size={16} color={theme.textSecondary} />}
          </TouchableOpacity>
        </View>
        <Text style={[styles.amount, { color: theme.textPrimary }]}>
          {showBalance ? `रू ${balance.toLocaleString()}` : '••••••••'}
        </Text>
      </View>

      <View style={[styles.footer, { borderTopColor: `${theme.border}40` }]}>
        <View style={styles.statContainer}>
          <View style={[styles.iconBg, { backgroundColor: `${theme.brandPrimary}15` }]}>
            <TrendingUp size={16} color={theme.brandPrimary} />
          </View>
          <View>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Monthly Growth</Text>
            <Text style={[styles.statValue, { color: theme.brandPrimary }]}>+12.5%</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.detailsBtn, { backgroundColor: `${theme.brandPrimary}10` }]}>
          <Text style={[styles.detailsText, { color: theme.brandPrimary }]}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    width: '100%',
    boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
    elevation: 8,
  },
  header: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  eyeBtn: {
    padding: 4,
  },
  amount: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  detailsBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  detailsText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
