import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

interface Props {
  size?: number;
  color?: string;
}

export const LoadingSpinner = ({ size = 48, color }: Props) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: color ? color + '20' : '#0AA97120' }]} />
      <Animated.View 
        style={[
          styles.spinningRing, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2, 
            borderTopColor: color || '#0AA971' 
          },
          animatedStyle
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 3,
  },
  spinningRing: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'transparent',
  },
});
