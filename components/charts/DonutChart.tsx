import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { AppTheme } from '../../constants/theme';

interface DonutChartProps {
  theme: AppTheme;
  data: any[];
  centerLabelValue?: string;
  centerLabelText?: string;
  radius?: number;
  innerRadius?: number;
}

export const DonutChart = ({
  theme,
  data,
  centerLabelValue,
  centerLabelText = 'TOTAL',
  radius = 80,
  innerRadiusSize,
}: any) => {
  const isDark = theme.background === '#121212';
  const defaultInnerRadius = radius * 0.75;

  return (
    <View style={styles.container}>
      <PieChart
        data={data}
        donut
        radius={radius}
        innerRadius={innerRadiusSize || defaultInnerRadius}
        innerCircleColor={theme.surface}
        centerLabelComponent={() => (
          <View style={styles.centerLabel}>
            <Text style={[styles.centerLabelText, { color: theme.textSecondary }]}>
              {centerLabelText}
            </Text>
            {centerLabelValue && (
              <Text style={[styles.centerLabelValue, { color: theme.textPrimary }]}>
                {centerLabelValue}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabelText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  centerLabelValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
});
