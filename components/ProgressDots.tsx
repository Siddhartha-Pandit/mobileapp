import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { AppTheme } from '../constants/theme';

interface Props {
  activeIndex: number;
  theme: AppTheme;
}

export const ProgressDots = ({ activeIndex, theme }: Props) => {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                activeIndex === index
                  ? theme.brandPrimary
                  : theme.textSecondary + '50',
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
