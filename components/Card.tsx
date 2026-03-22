import React from 'react';
import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle, type TextStyle, Platform } from 'react-native';
import type { AppTheme } from '../constants/theme';

export interface CardStyleProps {
  style?: StyleProp<ViewStyle>;
}

export interface CardTextStyleProps {
  style?: StyleProp<TextStyle>;
}

interface BaseViewProps extends CardStyleProps {
  theme?: AppTheme;
  children?: React.ReactNode;
}

interface BaseTextProps extends CardTextStyleProps {
  theme: AppTheme;
  children?: React.ReactNode;
}

interface CardProps extends BaseViewProps {
  theme: AppTheme;
  onPress?: () => void;
}

export const Card = ({ theme, children, onPress, style }: CardProps) => {
  const isDark = theme.background === '#121212';
  
  const shadowProps = Platform.select({
    ios: {
      boxShadow: `0px 1px 3px rgba(0,0,0,${isDark ? 0.3 : 0.05})`,
    },
    android: {
      elevation: isDark ? 2 : 1,
    },
    default: {
      boxShadow: `0px 1px 3px rgba(0,0,0,${isDark ? 0.3 : 0.05})`,
    }
  });

  const cardStyle = [
    styles.card,
    {
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    shadowProps,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...cardStyle,
          { opacity: pressed ? 0.9 : 1 }
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

export const CardHeader = ({ children, style }: BaseViewProps) => (
  <View style={[styles.header, style]}>{children}</View>
);

export const CardTitle = ({ theme, children, style }: BaseTextProps) => (
  <Text
    style={[
      styles.title,
      { color: theme.textPrimary },
      style,
    ]}
  >
    {children}
  </Text>
);

export const CardDescription = ({ theme, children, style }: BaseTextProps) => (
  <Text
    style={[
      styles.description,
      { color: theme.textSecondary },
      style,
    ]}
  >
    {children}
  </Text>
);

export const CardContent = ({ children, style }: BaseViewProps) => (
  <View style={[styles.content, style]}>{children}</View>
);

export const CardFooter = ({ theme, children, style }: BaseViewProps & { theme: AppTheme }) => (
  <View
    style={[
      styles.footer,
      { 
        borderTopColor: `${theme.border}40`,
      },
      style,
    ]}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'column',
    width: '100%',
  },
  header: {
    padding: 24,
    flexDirection: 'column',
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footer: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
  },
});
