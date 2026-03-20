import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  PanResponder, 
  TouchableOpacity 
} from 'react-native';
import type { AppTheme } from '../constants/theme';
import { Trash2 } from 'lucide-react-native';

interface Props {
  theme: AppTheme;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
  accentColor?: string;
  onDelete?: () => void;
}

export const NotificationItem = ({
  theme,
  icon,
  title,
  description,
  time,
  unread = false,
  accentColor,
  onDelete,
}: Props) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const isSwiped = useRef(false);

  // Maximum swipe distance (width of the delete button)
  const MAX_SWIPE = -80;

  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder only if horizontal movement is significant
      // This prevents the PanResponder from blocking vertical ScrollViews
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 10;
      },
      onPanResponderMove: (_, gestureState) => {
        let newX = isSwiped.current ? MAX_SWIPE + gestureState.dx : gestureState.dx;
        
        // Prevent swiping right beyond 0
        if (newX > 0) newX = 0;
        // Limit swiping left slightly past MAX_SWIPE for a slight friction effect
        if (newX < MAX_SWIPE - 20) newX = MAX_SWIPE - 20;

        translateX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        // If swiped far enough left, or if already open and not swiped too far right
        if (gestureState.dx < -40 || (isSwiped.current && gestureState.dx < 20)) {
          // Snap open
          Animated.spring(translateX, {
            toValue: MAX_SWIPE,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
          isSwiped.current = true;
        } else {
          // Snap closed
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
          }).start();
          isSwiped.current = false;
        }
      },
      // If a ScrollView takes over or touch is interrupted, snap it
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: isSwiped.current ? MAX_SWIPE : 0,
          useNativeDriver: true,
          bounciness: 0,
        }).start();
      }
    })
  ).current;

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      // Snap closed smoothly after delete action is triggered
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        isSwiped.current = false;
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderBottomColor: `${theme.border}40` }]}>
      {/* Background Delete Button */}
      {onDelete && (
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={handleDelete} 
            style={styles.deleteButton}
          >
            <Trash2 size={20} color="#fff" />
            <Text style={styles.deleteText}>DELETE</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Swipeable Foreground layer */}
      <Animated.View
        style={[
          styles.foregroundContainer,
          {
            backgroundColor: theme.surface,
            transform: [{ translateX }],
          }
        ]}
        {...(onDelete ? panResponder.panHandlers : {})}
      >
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: accentColor ? `${accentColor}15` : `${theme.brandPrimary}15` }
          ]}
        >
          {icon}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.title,
                { color: unread ? theme.textPrimary : theme.textSecondary }
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            {unread && <View style={styles.unreadIndicator} />}
          </View>

          <Text
            style={[styles.description, { color: theme.textSecondary }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {description}
          </Text>

          <Text style={[styles.timeText, { color: theme.textSecondary }]}>
            {time}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderBottomWidth: 1,
  },
  deleteButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  deleteText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  foregroundContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 14,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: '700',
    fontSize: 15,
    flex: 1, // Let title fill space but not push indicator off screen
    marginRight: 8,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginTop: 6,
  },
  description: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  timeText: {
    fontSize: 11,
    marginTop: 8,
  },
});
