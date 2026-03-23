import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { AppTheme } from '../constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  theme: AppTheme;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: any;
  textStyle?: any;
  textColor?: string;
  noShadow?: boolean;
}

export const PrimaryButton = ({ title, onPress, theme, isLoading, disabled, fullWidth, style, textStyle, textColor, noShadow }: Props) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        { backgroundColor: theme.brandPrimary },
        fullWidth && styles.fullWidth,
        (disabled || isLoading) && styles.disabled,
        !noShadow && styles.shadow,
        style,
      ]}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor || "#FFFFFF"} />
      ) : (
        <Text style={[styles.text, { color: textColor || '#FFFFFF' }, textStyle]}>{title}</Text>
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
  },
  shadow: {
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
