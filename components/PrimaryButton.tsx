import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
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
  backgroundColor?: string;
  noShadow?: boolean;
  icon?: React.ReactNode;
}

export const PrimaryButton = ({ 
  title, 
  onPress, 
  theme, 
  isLoading, 
  disabled, 
  fullWidth, 
  style, 
  textStyle, 
  textColor, 
  backgroundColor,
  noShadow,
  icon
}: Props) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        { backgroundColor: backgroundColor || theme.brandPrimary },
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
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text style={[styles.text, { color: textColor || '#FFFFFF' }, textStyle]}>{title}</Text>
        </View>
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
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 8,
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
