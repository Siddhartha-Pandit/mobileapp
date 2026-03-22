import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, AppTheme } from '@/constants/theme';

// Define the shape of the context state
type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: AppTheme;
  themeType: Theme;
  setThemeType: (theme: Theme) => void;
}

// Create the context
// Exporting for use in the useTheme hook
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props type
type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props): React.ReactNode {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<Theme>('system');
  const [theme, setTheme] = useState<AppTheme>(
    systemColorScheme === 'dark' ? darkTheme : lightTheme
  );

  useEffect(() => {
    if (themeType === 'system') {
      setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
    } else {
      setTheme(themeType === 'dark' ? darkTheme : lightTheme);
    }
  }, [themeType, systemColorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, themeType, setThemeType }}>
      {children}
    </ThemeContext.Provider>
  );
}
