import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { LoadingSpinner } from './LoadingSpinner';

export default function SplashScreen() {
  const { theme } = useTheme();

  const { width, height } = Dimensions.get('window');
  const isSmallDevice = width < 360;

  const logoSize = isSmallDevice ? 90 : 120;
  const titleSize = isSmallDevice ? 24 : 32;
  const taglineSize = isSmallDevice ? 12 : 14;
  const bottomSpacing = height < 650 ? 40 : 80;

  return (
    <LinearGradient
      colors={[theme.brandNavy, theme.background]}
      style={styles.container}
    >
      {/* Decorative Glows */}
      <View
        style={[
          styles.glow,
          { width: width * 0.6, height: width * 0.6, top: '10%', left: '-10%', backgroundColor: theme.brandPrimary },
        ]}
      />
      <View
        style={[
          styles.glow,
          {
            width: width * 0.7,
            height: width * 0.7,
            bottom: '10%',
            right: '-10%',
            backgroundColor: theme.brandNavy,
            opacity: 0.1,
          },
        ]}
      />

      {/* Center Content */}
      <View style={styles.centerContent}>
        <View
          style={[
            styles.logoContainer,
            { width: logoSize, height: logoSize, borderRadius: logoSize * 0.2 },
          ]}
        >
          <Image
            source={require('../assets/images/logosq.png')}
            style={styles.logo}
          />
        </View>
        <Text style={[styles.title, { fontSize: titleSize, color: theme.textPrimary }]}>
          Dhukuti
        </Text>
        <Text style={[styles.tagline, { fontSize: taglineSize, color: theme.textSecondary }]}>
          Your Financial Companion
        </Text>
      </View>

      {/* Bottom Loader */}
      <View style={[styles.bottomLoader, { bottom: bottomSpacing }]}>
        <LoadingSpinner size={isSmallDevice ? 28 : 36} color={theme.brandPrimary} />
        <View
          style={[
            styles.loaderBar,
            { width: isSmallDevice ? 90 : 120, backgroundColor: theme.textSecondary + '30' },
          ]}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  centerContent: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5, // for Android
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontWeight: '800',
    fontFamily: 'Manrope', // Make sure this font is loaded in your project
  },
  tagline: {
    marginTop: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  bottomLoader: {
    position: 'absolute',
    alignItems: 'center',
    gap: 24,
  },
  loaderBar: {
    height: 4,
    borderRadius: 999,
  },
  glow: {
    position: 'absolute',
    borderRadius: 1000, // A large number to make it a circle
    opacity: 0.15,
  },
});
