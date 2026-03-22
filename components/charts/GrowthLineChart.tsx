import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { AppTheme } from '../../constants/theme';

interface GrowthLineChartProps {
  theme: AppTheme;
  data: any[];
  height?: number;
  width?: number;
  curved?: boolean;
  hideDataPoints?: boolean;
  thickness?: number;
  areaChart?: boolean;
  color?: string;
  fillColor?: string;
}

export const GrowthLineChart = ({
  theme,
  data,
  height = 160,
  width,
  curved = true,
  hideDataPoints = true,
  thickness = 3,
  areaChart = true,
  color,
  fillColor,
}: any) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDark = theme.background === '#121212';
  
  // Robust width calculation
  const chartWidth = width || (windowWidth > 0 ? (windowWidth > 420 ? 340 : windowWidth - 80) : 300);
  const primaryColor = color || theme.brandPrimary;
  const areaFill = fillColor || `${primaryColor}40`;

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        areaChart={areaChart}
        curved={curved}
        hideDataPoints={hideDataPoints}
        thickness={thickness}
        color={primaryColor}
        startFillColor={areaFill}
        endFillColor="transparent"
        initialSpacing={10}
        noOfSections={3} // Prevents division by zero on Web
        hideYAxisText
        hideRules
        hideAxesAndRules
        width={chartWidth}
        height={height}
        yAxisThickness={0}
        xAxisThickness={0}
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
