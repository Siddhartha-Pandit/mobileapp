import React from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { CreditCard, Cpu } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import type { AppTheme } from '../constants/theme';

interface Props {
  theme: AppTheme;
  bank: string;
  number: string;
  balance: number;
  style?: StyleProp<ViewStyle>;
}

export const CreditCardAccountCard = ({
  theme,
  bank,
  number,
  balance,
  style,
}: Props) => {
  return (
    <View style={[styles.container, style]}>
      {/* Main Background Gradient */}
      <LinearGradient
        colors={[theme.brandNavy, '#1a1a1a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Decorative SVG Pattern Background */}
      <View style={styles.patternContainer}>
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern id="dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <Circle cx="2" cy="2" r="1" fill="#ffffff" opacity="0.1" />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#dots)" />
        </Svg>
      </View>

      <View style={styles.contentContainer}>
        {/* Top Row: Bank Name & Brand Color Accent */}
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.bankName, { color: theme.brandPrimary }]}>
              {bank}
            </Text>
            <View style={[styles.brandAccent, { backgroundColor: theme.brandPrimary }]} />
          </View>
          <CreditCard size={18} color="#ffffff" style={{ opacity: 0.6 }} />
        </View>

        {/* Middle Row: The "Chip" */}
        <View style={styles.chipWrapper}>
          <LinearGradient
            colors={['#ffd700', '#b8860b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.chip}
          >
            <Cpu size={14} color="rgba(0,0,0,0.5)" />
          </LinearGradient>
        </View>

        {/* Bottom Section: Number & Balance */}
        <View style={styles.bottomSection}>
          <Text style={styles.cardNumber}>
            •••• {number}
          </Text>
          <Text style={styles.balance}>
            ₨ {balance.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Glossy Overlay Reflection */}
      <View style={styles.glossyOverlayContainer} pointerEvents="none">
        <LinearGradient
          colors={['rgba(255,255,255,0.05)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glossyOverlay}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexBasis: 'auto',
    minWidth: 280,
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bankName: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  brandAccent: {
    height: 2,
    width: 24,
    marginTop: 4,
    borderRadius: 1,
  },
  chipWrapper: {
    marginTop: 8,
  },
  chip: {
    width: 34,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  bottomSection: {},
  cardNumber: {
    fontSize: 14,
    fontFamily: 'monospace',
    letterSpacing: 3,
    marginBottom: 4,
    color: 'rgba(255,255,255,0.7)',
  },
  balance: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  glossyOverlayContainer: {
    position: 'absolute',
    top: '-50%',
    left: '-20%',
    width: '140%',
    height: '140%',
    transform: [{ rotate: '-20deg' }],
  },
  glossyOverlay: {
    flex: 1,
  },
});
