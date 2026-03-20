import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Platform } from 'react-native';
import { Edit3 } from 'lucide-react-native';
import type { AppTheme } from '../constants/theme';

interface Props {
  theme: AppTheme;
  label: string;
  description: string;
  percentage: number;
  amount: number;
  color: string;
  onChange: (value: number) => void;
}

export const BudgetSlider = ({
  theme,
  label,
  description,
  percentage,
  amount,
  color,
  onChange,
}: Props) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Use refs to avoid stale closures inside PanResponder
  const startPercentageRef = useRef(percentage);
  const trackWidthRef = useRef(0);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const scaleValue = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        setIsDragging(true);
        Animated.spring(scaleValue, {
          toValue: 1.08,
          useNativeDriver: true,
        }).start();
        
        const width = trackWidthRef.current;
        if (width > 0) {
           const percent = (e.nativeEvent.locationX / width) * 100;
           const newPercent = Math.min(100, Math.max(0, percent));
           startPercentageRef.current = newPercent;
           onChangeRef.current(Math.round(newPercent));
        }
      },
      onPanResponderMove: (e, gestureState) => {
        const width = trackWidthRef.current;
        if (width > 0) {
          const percentMoved = (gestureState.dx / width) * 100;
          let newPercent = startPercentageRef.current + percentMoved;
          newPercent = Math.min(100, Math.max(0, newPercent));
          onChangeRef.current(Math.round(newPercent));
        }
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const isDark = theme.background === '#121212';
  
  const shadowProps = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: isDark ? 4 : 6 },
      shadowOpacity: isDark ? 0.6 : 0.15,
      shadowRadius: isDark ? 12 : 16,
    },
    android: {
      elevation: isDark ? 4 : 6,
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: isDark ? 4 : 6 },
      shadowOpacity: isDark ? 0.6 : 0.15,
      shadowRadius: isDark ? 12 : 16,
    }
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color }]}>{label}</Text>
            <Edit3 size={14} color={theme.textSecondary} />
          </View>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {description}
          </Text>
        </View>

        <View style={styles.valuesCol}>
          <Text style={[styles.percentage, { color }]}>{percentage}%</Text>
          <Text style={[styles.amount, { color: theme.textSecondary }]}>
            ₨ {amount.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Slider */}
      <View 
        style={styles.sliderContainer}
        onLayout={(e) => {
          const width = e.nativeEvent.layout.width;
          setTrackWidth(width);
          trackWidthRef.current = width;
        }}
        {...panResponder.panHandlers}
      >
        <View pointerEvents="none" style={styles.trackWrapper}>
          {/* Background Track */}
          <View
            style={[
              styles.trackBackground,
              { backgroundColor: theme.border }
            ]}
          />

          {/* Filled Track */}
          <View
            style={[
              styles.trackFill,
              { 
                width: `${percentage}%`,
                backgroundColor: color 
              }
            ]}
          />

          {/* Thumb */}
          <Animated.View
            style={[
              styles.thumb,
              {
                left: `${percentage}%`,
                transform: [
                  { translateX: -12 }, 
                  { scale: scaleValue }
                ],
                backgroundColor: theme.surface,
                borderColor: color,
              },
              shadowProps,
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
  },
  description: {
    fontSize: 11,
    marginTop: 2,
  },
  valuesCol: {
    alignItems: 'flex-end',
  },
  percentage: {
    fontWeight: '700',
    fontSize: 14,
  },
  amount: {
    fontSize: 12,
    marginTop: 2,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
  },
  trackWrapper: {
    position: 'relative',
    height: 24,
    justifyContent: 'center',
  },
  trackBackground: {
    position: 'absolute',
    width: '100%',
    height: 6,
    borderRadius: 999,
  },
  trackFill: {
    position: 'absolute',
    height: 6,
    borderRadius: 999,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
  },
});
