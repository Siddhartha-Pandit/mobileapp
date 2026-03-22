import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppTheme } from '../../constants/theme';

interface MiniBarChartProps {
  theme: AppTheme;
  data: number[];
  color?: string;
  height?: number;
}

export const MiniBarChart = ({
  theme,
  data,
  color,
  height = 30,
}: any) => {
  const barColor = color || theme.brandPrimary;

  return (
    <View style={[styles.container, { height }]}>
      {data.map((val: number, i: number) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              height: `${val * 100}%`,
              backgroundColor: barColor,
              opacity: 0.2 + (i * 0.15),
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
    alignItems: 'flex-end',
    gap: 4,
  },
  bar: {
    width: 6,
    borderRadius: 2,
  },
});
