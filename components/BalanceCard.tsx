import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import type { AppTheme } from '../constants/theme';

interface Props {
  theme: AppTheme;
  balance: number;
  growth?: number;
  onDetailPress?: () => void;
}

export const BalanceCard = ({ theme, balance, growth = 12.5, onDetailPress }: Props) => {
  const [showBalance, setShowBalance] = React.useState(true);
  const isPositive = growth >= 0;
  const growthColor = isPositive ? theme.brandPrimary : theme.danger;
  const TrendingIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <View style={styles.container}>
      {/* iOS style glassmorphism: higher intensity, darker tint over dark backgrounds */}
      <BlurView
        intensity={Platform.OS === 'ios' ? 40 : 80}
        tint="dark"
        style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
      />
      
      {/* Subtle depth overlay instead of pure white */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 24 }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Total Balance</Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)} style={styles.eyeBtn}>
              {showBalance ? <Eye size={16} color="rgba(255,255,255,0.7)" /> : <EyeOff size={16} color="rgba(255,255,255,0.7)" />}
            </TouchableOpacity>
          </View>
          <Text style={styles.amount}>
            {showBalance ? `रू ${balance.toLocaleString()}` : '••••••••'}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.statContainer}>
            <View style={[styles.iconBg, { backgroundColor: `${growthColor}25` }]}>
              <TrendingIcon size={16} color={growthColor} />
            </View>
            <View>
              <Text style={styles.statLabel}>Monthly Growth</Text>
              <Text style={[styles.statValue, { color: growthColor }]}>
                {isPositive ? '+' : ''}{growth}%
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={onDetailPress}
            style={[styles.detailsBtn, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
          >
            <Text style={styles.detailsText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
    elevation: 10,
  },
  content: {
    padding: 24,
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
    color: 'rgba(255,255,255,0.75)',
  },
  eyeBtn: {
    padding: 4,
  },
  amount: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
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
    color: 'rgba(255,255,255,0.5)',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  detailsBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
