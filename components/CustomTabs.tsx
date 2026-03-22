import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolateColor 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { AppTheme } from '../constants/theme';

interface TabOption {
  value: string;
  label: string;
}

interface Props {
  theme: AppTheme;
  options: TabOption[];
  activeTab: string;
  onChange: (value: string) => void;
}

export const CustomTabs = ({ theme, options, activeTab, onChange }: Props) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const tabWidth = containerWidth / options.length;
  
  const activeIndex = options.findIndex(opt => opt.value === activeTab);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (tabWidth > 0) {
      translateX.value = withTiming(activeIndex * tabWidth, {
        duration: 250,
      });
    }
  }, [activeIndex, tabWidth]);

  const onLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const handlePress = (value: string) => {
    if (value !== activeTab) {
      onChange(value);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    width: tabWidth - 8,
    transform: [{ translateX: translateX.value + 4 }],
  }));

  return (
    <View 
      style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onLayout={onLayout}
    >
      <Animated.View 
        style={[
          styles.indicator, 
          { backgroundColor: theme.brandPrimary }, 
          indicatorStyle
        ]} 
      />
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handlePress(option.value)}
          style={styles.tab}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === option.value ? '#FFFFFF' : theme.textSecondary }
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    padding: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    height: 36,
    borderRadius: 18,
    left: 0,
  },
  tab: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
