
export const Fonts = {
  rounded: 'ui-rounded-dreams',
  mono: 'space-mono',
};

const lightPalette = {
  brandPrimary: '#007AFF',     // A professional blue
  brandSecondary: '#5856D6',   // A complementary purple
  surface: '#FFFFFF',         // Card backgrounds, etc.
  background: '#F2F2F7',     // Main app background
  textPrimary: '#000000',      // For main headings and text
  textSecondary: '#6C6C70',    // For subheadings, captions
  border: '#C6C6C8',          // Borders and dividers
};

const darkPalette = {
  brandPrimary: '#0A84FF',     // A brighter blue for dark mode
  brandSecondary: '#5E5CE6',   // A brighter purple
  surface: '#1C1C1E',         // Dark card backgrounds
  background: '#000000',     // True black background
  textPrimary: '#FFFFFF',      // White text
  textSecondary: '#8D8D93',    // Lighter gray for secondary text
  border: '#38383A',          // Dark mode borders
};

export const lightTheme = {
  ...lightPalette,
};

export const darkTheme = {
  ...darkPalette,
};

export const Colors = {
  light: lightTheme,
  dark: darkTheme,
};

// This exports the TYPE of the theme for use in props
export type AppTheme = typeof lightTheme;
