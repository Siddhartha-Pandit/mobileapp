import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import type { AppTheme } from '../constants/theme';

interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
  theme: AppTheme;
}

export const ToggleSwitch = ({ checked, onChange, theme }: Props) => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(checked ? 22 : 0, { duration: 250 });
  }, [checked, translateX]);

  const animatedKnobStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      style={[
        styles.container,
        {
          backgroundColor: checked ? theme.brandPrimary : theme.border,
        },
      ]}
    >
      <Animated.View style={[styles.knob, animatedKnobStyle]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 52,
    height: 30,
    borderRadius: 20,
    padding: 4,
    justifyContent: 'center',
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
    elevation: 4, // for Android shadow
  },
});
