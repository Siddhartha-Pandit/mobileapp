import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { AppTheme } from '../constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  theme: AppTheme;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const PrimaryButton = ({ title, onPress, theme, isLoading, disabled, fullWidth }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: theme.brandPrimary },
        fullWidth && styles.fullWidth,
        (disabled || isLoading) && styles.disabled,
      ]}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.background} />
      ) : (
        <Text style={[styles.text, { color: theme.background }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    boxShadow: '0 8px 24px rgba(10, 169, 113, 0.25)',
  },
  fullWidth: {
    width: '100%',
    minWidth: undefined,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});
