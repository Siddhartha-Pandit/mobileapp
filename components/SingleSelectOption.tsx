import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { AppTheme } from '../constants/theme';

interface Props {
  theme: AppTheme;
  label: string;
  description: string;
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
  symbol: string;
}

export const SingleSelectOption = ({
  theme,
  label,
  description,
  value,
  selectedValue,
  onChange,
  symbol,
}: Props) => {
  const isSelected = selectedValue === value;

  return (
    <TouchableOpacity
      onPress={() => onChange(value)}
      style={[
        styles.container,
        {
          borderColor: isSelected ? theme.brandPrimary : theme.border,
          borderWidth: isSelected ? 2 : 1,
          backgroundColor: isSelected
            ? theme.brandPrimary + '10'
            : theme.surface,
        },
      ]}
    >
      <View style={styles.leftContainer}>
        {/* Symbol Circle */}
        <View
          style={[
            styles.symbolCircle,
            {
              backgroundColor: isSelected
                ? theme.brandPrimary + '20'
                : theme.background,
            },
          ]}
        >
          <Text
            style={[
              styles.symbolText,
              {
                color: isSelected ? theme.brandPrimary : theme.textSecondary,
              },
            ]}
          >
            {symbol}
          </Text>
        </View>

        <View>
          <Text style={[styles.labelText, { color: theme.textPrimary }]}>
            {label}
          </Text>
          <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
            {description}
          </Text>
        </View>
      </View>

      {/* Radio Indicator */}
      <View
        style={[
          styles.radioIndicator,
          {
            borderColor: isSelected ? theme.brandPrimary : theme.border,
            backgroundColor: isSelected ? theme.brandPrimary : 'transparent',
          },
        ]}
      >
        {isSelected && <View style={styles.radioIndicatorInner} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  symbolCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontWeight: '700',
    fontSize: 13,
  },
  labelText: {
    fontWeight: '700',
    fontSize: 14,
  },
  descriptionText: {
    fontSize: 11,
  },
  radioIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioIndicatorInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});
