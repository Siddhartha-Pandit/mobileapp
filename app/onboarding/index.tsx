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

export default function OnboardingScreen() {
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
          <ProgressDots activeIndex={0} theme={theme} />
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
            {/* Background Glow */}
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
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6vsCm2p9MT3xyUTei4xkYEGD4gZ6sbilMX4DRRFR51spltuC9GsIDbqRS0qPAmlKvoT6TUnEl68RUpjRNi0oIYyQAI3I3mM8rAapWtfkDRwIjaodCnbZ2ldC5DlcZHyu5Q6ZXEFx0Qce_2SivfL4p-cSzlgnOplA9x2SlxutD0L7SqH4H01qkVWt85LDfZJwnf-3Z_tUi_44vojzVF2fi1eNwG9Fqgpi_t7kPFgX-n73IZDUd2uXsUas34ZnOegvBzLY3X3KluYI',
              }}
              style={[{ width: illustrationSize, height: illustrationSize }, styles.illustrationImage]}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { fontSize: titleSize, color: theme.textPrimary }]}>
            Track Every Rupee
          </Text>

          <Text style={[styles.text, { fontSize: textSize, color: theme.textSecondary }]}>
            Monitor all your accounts, expenses, and income in one place. Never
            lose track of your money again.
          </Text>
        </View>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Next"
            theme={theme}
            onPress={() => router.push('/onboarding/investments' as any)}
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
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    fontWeight: '600',
    fontSize: 14,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.1,
  },
  illustrationImage: {
  },
  contentContainer: {
    marginBottom: 32,
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
  buttonContainer: {
    alignItems: 'center',
  },
});
