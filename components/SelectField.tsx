import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { SectionHeader } from './SectionHeader';
import type { AppTheme } from '../constants/theme';

interface SelectFieldProps {
  theme: AppTheme;
  label: string;
  icon: React.ReactNode;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

export const SelectField = ({ theme, label, icon, value, options, onChange }: SelectFieldProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: `${theme.border}40`,
        },
      ]}
    >
      <SectionHeader
        theme={theme}
        variant="label"
        title={label}
        icon={icon}
        marginBottom={8}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => onChange(itemValue)}
          style={styles.picker}
          itemStyle={{
            color: theme.textPrimary, // Note: itemStyle is iOS-only
          }}
        >
          {options.map((opt) => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
        <View style={styles.chevronContainer}>
          <ChevronDown size={18} color={theme.textSecondary} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
  },
  pickerContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  picker: {
    // On Android, the picker has its own UI, so some styles might not apply
    // On iOS, we can style it more freely
    width: '100%',
    height: 30, // Adjust height as needed
    color: '#000', // This is for Android dropdown text color
    backgroundColor: 'transparent',
  },
  chevronContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10, // Add some padding for the icon
    pointerEvents: 'none', // Make sure it doesn't block touch events
  },
});
