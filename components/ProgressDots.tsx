import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import type { AppTheme } from '../constants/theme';

interface Props {
  activeIndex: number;
  total?: number;
  theme: AppTheme;
}

const Dot = ({ isActive, theme }: { isActive: boolean; theme: AppTheme }) => {
  // 1 when true, 0 when false. Used to drive the animations.
  const animatedValue = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    // Replicates CSS 'transition: "all 0.3s ease"' natively
    animatedValue.value = withTiming(isActive ? 1 : 0, { duration: 300 });
  }, [isActive, animatedValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animatedValue.value,
      [0, 1],
      [`${theme.textSecondary}40`, theme.brandPrimary]
    );

    return {
      backgroundColor,
      // Fade in the glowing CSS box-shadow counterpart based on active state
      shadowOpacity: animatedValue.value * 0.8,
      // Subtle organic scale bounce effect to enhance premium UX feel
      transform: [
        { scale: 1 + (animatedValue.value * 0.3) } // Inflate slightly to 1.3x size
      ]
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        animatedStyle,
        {
          // Setup static shadow configurations to be revealed dynamically
          shadowColor: theme.brandPrimary,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 8,
          // Fixed elevation value for Android layer shadows 
          // Note: dynamic elevation changes on Android can jitter, so scale performs the interaction.
          elevation: isActive ? 6 : 0, 
        }
      ]}
    />
  );
};

export const ProgressDots = ({
  activeIndex,
  total = 3,
  theme,
}: Props) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <Dot key={index} isActive={index === activeIndex} theme={theme} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5, // Circle (999 CSS mapped to 50% of width 10 natively)
  },
});
