import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { AppTheme } from '../../constants/theme';

interface MiniSparklineProps {
  theme: AppTheme;
  data: any[];
  height?: number;
  width?: number;
  color?: string;
  fillColor?: string;
}

export const MiniSparkline = ({
  theme,
  data,
  height = 60,
  width,
  color,
  fillColor,
}: any) => {
  const { width: windowWidth } = useWindowDimensions();
  const primaryColor = color || theme.brandPrimary;
  const areaFill = fillColor || `${primaryColor}20`;
  const chartWidth = width || (windowWidth > 0 ? (windowWidth - 80) : 280);

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        areaChart
        hideDataPoints
        thickness={2}
        color={primaryColor}
        startFillColor={areaFill}
        endFillColor="transparent"
        initialSpacing={10}
        noOfSections={3}
        hideYAxisText
        hideRules
        hideAxesAndRules
        width={chartWidth}
        height={height}
        curved
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
