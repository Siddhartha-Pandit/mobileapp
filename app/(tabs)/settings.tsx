import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

const SettingsPage = () => {
  const { theme, themeType, setThemeType } = useTheme();

  const themes = ['light', 'dark', 'system'] as const;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.textPrimary }]}>Theme Settings</Text>
      <View style={styles.optionsContainer}>
        {themes.map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.optionButton,
              { 
                backgroundColor: themeType === t ? theme.brandPrimary : theme.surface, 
                borderColor: theme.border
              },
            ]}
            onPress={() => setThemeType(t)}
          >
            <Text style={[{ color: themeType === t ? '#fff' : theme.textPrimary }, styles.optionText]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 30,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsPage;
