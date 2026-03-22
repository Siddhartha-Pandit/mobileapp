import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import type { AppTheme } from '../constants/theme';

interface Props {
  theme: AppTheme;
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
}

export const StepProgress = ({
  theme,
  step,
  totalSteps,
  title,
  subtitle,
}: Props) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming((step / totalSteps) * 100, { duration: 400 });
  }, [step, totalSteps, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View
        style={[
          styles.progressBarContainer,
          { backgroundColor: theme.brandPrimary + '20' },
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            { backgroundColor: theme.brandPrimary },
            animatedStyle,
          ]}
        />
      </View>

      {/* Step Label */}
      <Text style={[styles.stepLabel, { color: theme.brandPrimary }]}>
        Step {step} of {totalSteps}
      </Text>

      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    borderRadius: 20,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 14 * 1.6, // 1.6 times the font size
    maxWidth: 280,
  },
});
