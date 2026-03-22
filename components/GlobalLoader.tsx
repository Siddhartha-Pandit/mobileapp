import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  interpolate,
  withSequence,
  Extrapolate
} from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
import { useLoadingStore } from '../src/store/useLoadingStore';

const { width, height } = Dimensions.get('window');

export const GlobalLoader = () => {
  const { isLoading, loadingText } = useLoadingStore();
  const { theme, themeType } = useTheme();
  
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (isLoading) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1500, easing: Easing.linear }),
        -1,
        false
      );
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      rotation.value = 0;
      pulse.value = 1;
    }
  }, [isLoading]);

  const animatedSpinnerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.2], [0.8, 1], Extrapolate.CLAMP),
  }));

  if (!isLoading) return null;

  const isDark = themeType === 'dark' || (themeType === 'system' && theme.background === '#121212');

  return (
    <View style={styles.container}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 30 : 80}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <View style={styles.loaderWrapper}>
          {/* Main animated ring */}
          <Animated.View style={[styles.ring, { borderColor: theme.brandPrimary + '20' }]} />
          
          <Animated.View 
            style={[
              styles.spinningRing, 
              { borderTopColor: theme.brandPrimary },
              animatedSpinnerStyle
            ]} 
          />
          
          {/* Center Branded Element */}
          <Animated.View 
            style={[
              styles.centerDot, 
              { backgroundColor: theme.brandPrimary },
              animatedLogoStyle
            ]} 
          />
        </View>

        {loadingText && (
          <Animated.Text 
            style={[
              styles.text, 
              { color: theme.textPrimary, fontFamily: 'ui-rounded-dreams' }
            ]}
          >
            {loadingText}
          </Animated.Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  ring: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
  },
  spinningRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: 'transparent',
  },
  centerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    boxShadow: '0 0 15px rgba(10, 169, 113, 0.5)',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
