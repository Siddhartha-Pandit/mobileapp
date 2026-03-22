import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { AppTheme } from '../../constants/theme';

interface CircularProgressProps {
  theme: AppTheme;
  size?: number;
  strokeWidth?: number;
  percentage: number;
  centerLabel?: string;
  centerSubLabel?: string;
  color?: string;
}

export const CircularProgress = ({
  theme,
  size = 160,
  strokeWidth = 7,
  percentage,
  centerLabel,
  centerSubLabel,
  color,
}: any) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const primaryColor = color || theme.brandPrimary;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`${primaryColor}15`}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={primaryColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {(centerLabel || centerSubLabel) && (
        <View style={styles.labelContainer}>
          {centerLabel && (
            <Text style={[styles.centerLabel, { color: theme.textPrimary }]}>
              {centerLabel}
              {centerSubLabel && (
                <Text style={[styles.centerSubLabel, { color: theme.textSecondary }]}>
                  {centerSubLabel}
                </Text>
              )}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontSize: 32,
    fontWeight: '800',
  },
  centerSubLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
