import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Loader2 } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

interface Props {
  size?: number;
  color: string;
  fullScreen?: boolean;
  background?: string;
}

export const LoadingSpinner = ({
  size = 32,
  color,
  fullScreen = false,
  background,
}: Props) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 900,
        easing: Easing.linear,
      }),
      -1, // -1 means infinite loop
      false // Don't reverse the animation
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View
      // Use absolute coordinates and high z-index/elevation if meant for a full overlay
      style={[
        styles.container,
        fullScreen && [
          styles.fullScreen,
          { backgroundColor: background || 'transparent' }
        ],
      ]}
      // Prevents touches passing through the spinner if fullScreen is true
      pointerEvents={fullScreen ? "auto" : "none"}
    >
      <Animated.View style={animatedStyle}>
        <Loader2 size={size} color={color} strokeWidth={2.5} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    zIndex: 9999,
    elevation: Platform.OS === 'android' ? 99 : 0, 
  },
});
