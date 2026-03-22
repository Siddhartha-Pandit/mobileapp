
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { ProgressDots } from '../../components/ProgressDots';
import { PrimaryButton } from '../../components/PrimaryButton';

export default function OnboardingInvestmentsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isSmall = width < 360;

  const illustrationSize = isSmall ? 220 : 280;
  const titleSize = isSmall ? 22 : 28;
  const textSize = isSmall ? 14 : 16;

  return (
    <LinearGradient
      colors={[theme.brandNavy, theme.background]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <ProgressDots activeIndex={1} theme={theme} />
          <TouchableOpacity onPress={() => router.replace('/login' as any)}>
            <Text style={[styles.skipButton, { color: theme.textSecondary }]}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View
            style={{
              width: illustrationSize,
              height: illustrationSize,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Glow */}
            <View
              style={[
                styles.glow,
                {
                  width: illustrationSize * 0.8,
                  height: illustrationSize * 0.8,
                  backgroundColor: theme.brandPrimary,
                },
              ]}
            />

            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdZWhC7O9NcRdMPieNzHK5zhSxDJTaFM7u6-9AGqbIsI8qe8mT7F9SHPlmzfp9d6Se-F9b5kPvmJCSO8LcSGLuKAeWLyD9kBggXKwntOvspRRLaH03O8FGfnGSeUxrQqXVtltR7hZeIYyp6MgWEVmWI38UBI36v8y853RW9BjFMWgRVNgJIM2G69zxfQgrC5L9jl2wpEXhFwasgL6kAkX0SLnd1XcvVc0fX7CDNfQUtkrb4BMrd0I2_bX0e2xoI4eArfsRirjZ9KdG',
              }}
              style={[styles.mainImage, { width: illustrationSize, height: illustrationSize }]}
              resizeMode="contain"
            />
            
            {/* Floating Badge 1 */}
            <View style={[styles.badge, styles.badge1, { backgroundColor: theme.brandPrimary + '30', borderColor: theme.brandPrimary + '40'}]}>
                <Text style={styles.badgeEmoji}>📈</Text>
            </View>
            
            {/* Floating Badge 2 */}
            <View style={[styles.badge, styles.badge2, { backgroundColor: theme.surface + '20', borderColor: theme.textSecondary + '30' }]}>
                <Text style={styles.badgeEmoji}>💰</Text>
            </View>

          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { fontSize: titleSize, color: theme.textPrimary }]}>
            Manage Investments
          </Text>
          <Text style={[styles.text, { fontSize: textSize, color: theme.textSecondary }]}>
            Track stocks from NEPSE, monitor gold and silver prices, and watch your portfolio grow with real-time updates.
          </Text>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: theme.textSecondary + '20' }]}>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.backButton, { color: theme.textSecondary }]}>
                    Back
                </Text>
            </TouchableOpacity>
            <PrimaryButton
                title="Next"
                theme={theme}
                onPress={() => router.push('/onboarding/insights' as any)}
            />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
  },
  skipButton: {
    fontWeight: '600',
    fontSize: 14,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  glow: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.1,
  },
  mainImage: {
      borderRadius: 24,
  },
  badge: {
      position: 'absolute',
      padding: 12,
      borderRadius: 16,
      borderWidth: 1,
  },
  badgeEmoji: {
      fontSize: 20,
  },
  badge1: {
      top: -12,
      right: -12,
  },
  badge2: {
      bottom: -10,
      left: -12,
  },
  contentContainer: {
    textAlign: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  text: {
    textAlign: 'center',
    maxWidth: 320,
    alignSelf: 'center',
    lineHeight: 22,
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      paddingTop: 16,
      paddingBottom: 32,
  },
  backButton: {
      fontWeight: '600',
      fontSize: 14,
  }
});
