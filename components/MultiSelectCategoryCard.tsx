import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { AppTheme } from '../constants/theme';

interface Props {
  theme: AppTheme;
  label: string;
  icon: LucideIcon;
  value: string;
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export const MultiSelectCategoryCard = ({
  theme,
  label,
  icon: Icon,
  value,
  selectedValues,
  onToggle,
}: Props) => {
  const isSelected = selectedValues.includes(value);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(value)}
      style={[
        styles.cardContainer,
        {
          backgroundColor: isSelected ? `${theme.brandPrimary}10` : theme.surface,
          borderColor: isSelected ? theme.brandPrimary : theme.border,
          borderWidth: isSelected ? 2 : 1,
        },
        isSelected ? [styles.shadowSelected, { boxShadow: `0px 6px 16px ${theme.brandPrimary}33` }] : styles.shadowDefault,
      ]}
    >
      {/* Left section: Icon + Label */}
      <View style={styles.leftSection}>
        <Icon
          size={18}
          color={isSelected ? theme.brandPrimary : theme.textSecondary}
        />
        <Text
          style={[
            styles.label,
            { color: theme.textPrimary },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      </View>

      {/* Right section: Checkbox tick */}
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: isSelected ? theme.brandPrimary : 'transparent',
            borderColor: isSelected ? theme.brandPrimary : theme.border,
          },
        ]}
      >
        {isSelected && <Check size={12} color="#fff" strokeWidth={3} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: 56,
    paddingHorizontal: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shadowSelected: {
    boxShadow: '0px 6px 16px rgba(0,0,0,0.2)',
    elevation: 4,
  },
  shadowDefault: {
    boxShadow: '0px 2px 6px rgba(0,0,0,0.04)',
    elevation: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1, // Allow text to take remaining space but respect spacing
    paddingRight: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1, // Ensures long text truncates properly alongside the icon
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
