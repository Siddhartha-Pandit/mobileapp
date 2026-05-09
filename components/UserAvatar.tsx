import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { AppTheme } from '../constants/theme';

interface UserAvatarProps {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  size?: number;
  theme: AppTheme;
  style?: ViewStyle;
}

import { LinearGradient } from 'expo-linear-gradient';

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  fullName, 
  email, 
  avatarUrl, 
  size = 50, 
  theme,
  style 
}) => {
  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const generateGradient = (emailStr: string = '') => {
    let hash = 0;
    for (let i = 0; i < emailStr.length; i++) {
      hash = emailStr.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = Math.abs(hash) % 360;
    const s = 65 + (Math.abs(hash) % 15); 
    const l = 45 + (Math.abs(hash) % 10);
    
    const color1 = `hsl(${h}, ${s}%, ${l}%)`;
    const color2 = `hsl(${(h + 40) % 360}, ${s}%, ${l - 10}%)`;
    
    return [color1, color2];
  };

  const initials = getInitials(fullName || 'User');
  const colors = generateGradient(email || fullName || 'default');

  const [hasImageError, setHasImageError] = React.useState(false);

  if (avatarUrl && !hasImageError) {
    return (
      <Image 
        source={{ uri: avatarUrl }} 
        style={[
          styles.avatar, 
          { width: size, height: size, borderRadius: size / 2 },
          style
        ] as any} 
        onError={() => setHasImageError(true)}
      />
    );
  }

  return (
    <LinearGradient
      colors={colors as [string, string, ...string[]]}
      style={[
        styles.avatar, 
        { 
          flex: 1,
          width: '100%', 
          height: '100%', 
          borderRadius: size / 2,
        },
        style
      ]}
    >
      <Text style={[
        styles.initials, 
        { fontSize: size * 0.4, color: '#FFFFFF', textAlign: 'center' }
      ]}>
        {initials}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});

export default UserAvatar;
