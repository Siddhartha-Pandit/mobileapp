import React from 'react';
import { 
  Text, 
  Pressable, 
  StyleSheet, 
  type StyleProp, 
  type ViewStyle 
} from 'react-native';
import type { AppTheme } from '../constants/theme';

interface Props {
  title: string;
  onClick?: () => void;
  theme: AppTheme;
  fullWidth?: boolean;
  // Note: HTML 'type' prop (submit, reset) doesn't apply to React Native, 
  // so it's safely omitted from these props to maintain clean mobile architecture.
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const PrimaryButton = ({
  title,
  onClick,
  theme,
  fullWidth = false,
  disabled = false,
  style,
}: Props) => {
  return (
    <Pressable
      onPress={disabled ? undefined : onClick}
      disabled={disabled}
      style={({ pressed }) => [
        styles.baseButton,
        {
          width: fullWidth ? '100%' : 180,
          backgroundColor: disabled ? theme.border : theme.brandPrimary,
          
          // Shadows
          shadowColor: disabled ? 'transparent' : theme.brandPrimary,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: disabled ? 0 : 0.4,
          shadowRadius: 20,
          elevation: disabled ? 0 : 8,
          
          // Replicates the precise CSS transform scale on MouseDown/MouseUp
          transform: [{ scale: pressed && !disabled ? 0.96 : 1 }],
        },
        style,
      ]}
    >
      <Text style={styles.textLabel}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 0, // React Native equivalent to border: "none"
    alignItems: 'center',
    justifyContent: 'center',
  },
  textLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
