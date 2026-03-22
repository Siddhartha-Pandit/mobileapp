import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Camera } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { AppTheme } from '../constants/theme';

interface Props {
  theme: AppTheme;
  name: string;
  imageUrl?: string;
  size?: number;
  editable?: boolean;
  onEdit?: () => void;
}

export const Avatar = ({
  theme,
  name,
  imageUrl,
  size = 120,
  editable = false,
  onEdit,
}: Props) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const hasImage = Boolean(imageUrl);

  // Dynamic shadow properties to match your web version mapping depending on the theme
  const isDark = theme.background === '#000000';
  const shadowProps = Platform.select({
    ios: {
      boxShadow: `0px ${isDark ? 10 : 15}px ${isDark ? 30 : 35}px rgba(0,0,0,${isDark ? 0.6 : 0.15})`,
    },
    android: {
      elevation: isDark ? 12 : 20,
    },
    default: {
      boxShadow: `0px ${isDark ? 10 : 15}px ${isDark ? 30 : 35}px rgba(0,0,0,${isDark ? 0.6 : 0.15})`,
    }
  });

  return (
    <View style={[{ width: size, height: size }, styles.container]}>
      {/* Avatar Circle */}
      {hasImage ? (
        <View
          style={[
            styles.avatarContainer,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: theme.surface,
              borderColor: theme.background,
            },
            shadowProps,
          ]}
        >
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      ) : (
        <LinearGradient
          colors={[theme.brandPrimary, theme.brandSecondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.avatarContainer,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: theme.background,
            },
            shadowProps,
          ]}
        >
          <Text style={[styles.initialsText, { fontSize: size * 0.32 }]}>
            {initials}
          </Text>
        </LinearGradient>
      )}

      {/* Edit Button */}
      {editable && (
        <TouchableOpacity
          onPress={onEdit}
          activeOpacity={0.8}
          style={[
            styles.editButton,
            {
              backgroundColor: theme.brandPrimary,
              borderColor: theme.background,
            },
          ]}
        >
          <Camera size={18} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initialsText: {
    color: '#fff',
    fontWeight: '800',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    boxShadow: '0px 6px 16px rgba(0,0,0,0.25)',
    elevation: 6,
  },
});
