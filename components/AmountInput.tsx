import React from 'react';
import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { SectionHeader } from './SectionHeader';
import { Card, CardContent } from './Card';
import type { AppTheme } from '../constants/theme';

interface AmountInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  theme: AppTheme;
  currency?: string;
  placeholder?: string;
  autoFocus?: boolean;
  color?: string; // Color for the currency symbol
  containerStyle?: ViewStyle;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  label,
  value,
  onChangeText,
  theme,
  currency = "Rs",
  placeholder = "0",
  autoFocus = false,
  color,
  containerStyle
}) => {
  const displayColor = color || theme.brandPrimary;

  return (
    <Card theme={theme} style={[styles.amountCard, { backgroundColor: theme.surface, borderColor: `${theme.border}50` }, containerStyle]}>
      <CardContent theme={theme} style={styles.cardContent}>
        <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>{label.toUpperCase()}</Text>
        <View style={styles.inputRow}>
          <Text style={[styles.currencySymbol, { color: displayColor }]}>{currency}</Text>
          <TextInput
            keyboardType="numeric"
            placeholder={placeholder}
            placeholderTextColor={theme.textSecondary}
            value={value}
            onChangeText={onChangeText}
            autoFocus={autoFocus}
            style={[styles.amountInput, { color: theme.textPrimary }]}
          />
        </View>
      </CardContent>
    </Card>
  );
};

const styles = StyleSheet.create({
  amountCard: {
    borderRadius: 30,
    borderWidth: 1,
    boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
    elevation: 2,
    marginBottom: 32,
  },
  cardContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "800",
    marginRight: 10,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "800",
    minWidth: 120,
    textAlign: 'center',
    padding: 0,
  },
});

