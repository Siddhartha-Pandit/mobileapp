/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export interface AppTheme {
  brandPrimary: string;
  brandNavy: string;

  background: string;
  surface: string;
  hover: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  danger: string;
  warning: string;
}

export const lightTheme: AppTheme = {
  brandPrimary: "#0AA971",
  brandNavy: "#033766",

  background: "#FDFDFD",
  surface: "#FFFFFF",
  hover: "#F3F4F6",
  border: "#E5E7EB",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  danger: "#DC2626",   
  warning: "#D97706",  
};

export const darkTheme: AppTheme = {
  brandPrimary: "#0AA971",
  brandNavy: "#033766",

  background: "#121212",
  surface: "#1E1E1E",
  hover: "#2A2A2A",
  border: "#2C2C2C",
  textPrimary: "#EAEAEA",
  textSecondary: "#A1A1AA",
  danger: "#F87171",   
  warning: "#FBBF24", 
};

export const Colors = {
  light: {
    ...lightTheme,
    text: lightTheme.textPrimary,
    tint: lightTheme.brandPrimary,
    icon: lightTheme.textSecondary,
    tabIconDefault: lightTheme.textSecondary,
    tabIconSelected: lightTheme.brandPrimary,
  },
  dark: {
    ...darkTheme,
    text: darkTheme.textPrimary,
    tint: darkTheme.brandPrimary,
    icon: darkTheme.textSecondary,
    tabIconDefault: darkTheme.textSecondary,
    tabIconSelected: darkTheme.brandPrimary,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
