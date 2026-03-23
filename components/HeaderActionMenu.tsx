import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  TouchableWithoutFeedback, 
  Platform 
} from 'react-native';
import { Edit2, Trash2 } from 'lucide-react-native';
import { AppTheme } from '../constants/theme';

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  isDestructive?: boolean;
}

interface HeaderActionMenuProps {
  visible: boolean;
  onClose: () => void;
  items: ActionItem[];
  theme: AppTheme;
  anchorPosition?: { top: number; right: number };
}

export const HeaderActionMenu = ({ visible, onClose, items, theme, anchorPosition }: HeaderActionMenuProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View 
            style={[
              styles.content, 
              { 
                backgroundColor: theme.surface, 
                borderColor: theme.border,
                top: anchorPosition?.top || (Platform.OS === 'ios' ? 100 : 70),
                right: anchorPosition?.right || 24,
              }
            ]}
          >
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity 
                  style={styles.item} 
                  onPress={() => {
                    item.onPress();
                    onClose();
                  }}
                >
                  {item.icon}
                  <Text 
                    style={[
                      styles.text, 
                      { color: item.isDestructive ? theme.danger || '#ef4444' : theme.textPrimary }
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
                {index < items.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: theme.border, opacity: 0.1 }]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  content: {
    position: 'absolute',
    width: 180,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});
