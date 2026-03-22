export const Fonts = {
  rounded: 'ui-rounded-dreams',
  mono: 'space-mono',
};

export interface AppTheme {
  brandPrimary: string;
  brandNavy: string;
  background: string;
  surface: string;
  hover: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  brandSecondary: string;
  danger: string;
  warning: string;
}

export const lightTheme: AppTheme = {
  brandPrimary: '#0AA971',
  brandNavy: '#033766',
  brandSecondary: '#033766',
  background: '#FDFDFD',
  surface: '#FFFFFF',
  hover: '#F3F4F6',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  danger: '#DC2626',
  warning: '#D97706',
};

export const darkTheme: AppTheme = {
  brandPrimary: '#0AA971',
  brandNavy: '#033766',
  brandSecondary: '#033766',
  background: '#121212',
  surface: '#1E1E1E',
  hover: '#2A2A2A',
  border: '#2C2C2C',
  textPrimary: '#EAEAEA',
  textSecondary: '#A1A1AA',
  danger: '#F87171',
  warning: '#FBBF24',
};

export const Colors = {
  light: lightTheme,
  dark: darkTheme,
};
