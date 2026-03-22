import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { AppTheme } from '../constants/theme';

interface Props {
  theme: AppTheme;
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

export const SegmentTabs = ({
  theme,
  tabs,
  active,
  onChange,
}: Props) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = active === tab;

        return (
          <Pressable
            key={tab}
            onPress={() => onChange(tab)}
            style={[
              styles.tab,
              {
                backgroundColor: isActive
                  ? theme.brandPrimary
                  : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: isActive ? '#fff' : theme.textSecondary,
                },
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontWeight: '700',
    fontSize: 12,
  },
});
