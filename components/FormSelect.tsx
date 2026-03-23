import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  ViewStyle,
  Pressable,
} from 'react-native';
import { ChevronDown, X, Check } from 'lucide-react-native';
import { AppTheme } from '../constants/theme';
import { Card } from './Card';

interface FormSelectProps {
  label: string;
  value: string;
  onSelect: (val: string) => void;
  options: string[] | { label: string; value: string }[];
  theme: AppTheme;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onSelect,
  options,
  theme,
  icon,
  containerStyle,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const selectedLabel = Array.isArray(options) 
    ? (typeof options[0] === 'string' 
        ? value 
        : (options as { label: string; value: string }[]).find(o => o.value === value)?.label || value)
    : value;

  const handleSelect = (val: string) => {
    onSelect(val);
    setIsVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {label.toUpperCase()}
      </Text>
      
      <TouchableOpacity 
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
        style={[
          styles.inputWrapper, 
          { 
            backgroundColor: theme.surface,
            borderColor: `${theme.border}40`,
          }
        ]}
      >
        {icon && (
          <View style={styles.iconBox}>
            {React.cloneElement(icon as React.ReactElement<any>, { 
              size: 20, 
              color: theme.textSecondary 
            })}
          </View>
        )}
        <Text style={[styles.valueText, { color: value ? theme.textPrimary : theme.textSecondary }]}>
          {selectedLabel || 'Select option...'}
        </Text>
        <ChevronDown size={18} color={theme.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsVisible(false)}>
          <Pressable>
          <Card theme={theme} style={styles.modalCard}>
            <View style={[styles.modalHeader, { borderBottomColor: `${theme.border}40` }]}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{label}</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <X size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options as any[]}
              keyExtractor={(item: any, index: number) => (typeof item === 'string' ? item : item.value)}
              renderItem={({ item }: { item: any }) => {
                const itemLabel = typeof item === 'string' ? item : item.label;
                const itemValue = typeof item === 'string' ? item : item.value;
                const isSelected = itemValue === value;
                
                return (
                  <TouchableOpacity 
                    onPress={() => handleSelect(itemValue)}
                    style={[
                      styles.optionItem,
                      isSelected && { backgroundColor: `${theme.brandPrimary}10` }
                    ]}
                  >
                    <Text style={[
                      styles.optionText, 
                      { color: isSelected ? theme.brandPrimary : theme.textPrimary }
                    ]}>
                      {itemLabel}
                    </Text>
                    {isSelected && <Check size={18} color={theme.brandPrimary} />}
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.listContent}
            />
          </Card>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  },
  iconBox: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: 40,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 24,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
