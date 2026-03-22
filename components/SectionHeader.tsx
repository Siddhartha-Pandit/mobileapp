import React from 'react';
import { View, Text, StyleSheet, StyleProp, TextStyle, TouchableOpacity } from 'react-native';
import type { AppTheme } from '../constants/theme';

interface SectionHeaderProps {
  theme: AppTheme;
  title: string;
  icon?: React.ReactNode;
  rightComponent?: React.ReactNode;
  rightLabel?: string;
  onRightPress?: () => void;
  variant?: 'header' | 'label';
  marginBottom?: number;
  paddingHorizontal?: number;
  uppercase?: boolean;
  align?: 'left' | 'center' | 'between';
  gap?: number;
}

export const SectionHeader = ({
  theme,
  title,
  icon,
  rightComponent,
  rightLabel,
  onRightPress,
  variant = 'header',
  marginBottom = 16,
  paddingHorizontal = 0,
  uppercase,
  align = 'between',
  gap = 8,
}: SectionHeaderProps) => {
  const isLabel = variant === 'label';

  const justifyMap = {
    between: 'space-between',
    center: 'center',
    left: 'flex-start',
  } as const;

  const titleStyle: StyleProp<TextStyle> = [
    styles.title,
    {
        fontSize: isLabel ? 11 : 13,
        fontWeight: '800',
        color: isLabel ? theme.textSecondary : theme.textPrimary,
        textTransform: uppercase !== undefined
            ? (uppercase ? 'uppercase' : 'none')
            : (isLabel ? 'uppercase' : 'none'),
        letterSpacing: isLabel ? 0.5 : undefined,
    }
  ];

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: justifyMap[align],
          marginBottom,
          paddingLeft: paddingHorizontal || (isLabel ? 4 : 0),
          paddingRight: paddingHorizontal,
          gap,
        },
      ]}
    >
      <View style={[styles.leftContainer, { gap: 8 }]}>
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
        <Text style={titleStyle}>
          {title}
        </Text>
      </View>

      {(rightComponent || rightLabel) && (
        <View>
          {rightComponent || (
            <TouchableOpacity onPress={onRightPress} activeOpacity={0.7}>
              <Text style={[styles.rightLabel, { color: theme.brandPrimary }]}>
                {rightLabel}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    lineHeight: undefined
  },
  rightLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  }
});
