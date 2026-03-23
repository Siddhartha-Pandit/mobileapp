import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  ViewStyle,
  KeyboardTypeOptions
} from 'react-native';
import { AppTheme } from '../constants/theme';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  theme: AppTheme;
  placeholder?: string;
  icon?: React.ReactNode;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  containerStyle?: ViewStyle;
  multiline?: boolean;
  maxLength?: number;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  theme,
  placeholder,
  icon,
  keyboardType = 'default',
  secureTextEntry = false,
  containerStyle,
  multiline = false,
  maxLength,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderOpacity = new Animated.Value(isFocused ? 1 : 0.3);

  React.useEffect(() => {
    Animated.timing(borderOpacity, {
      toValue: isFocused ? 1 : 0.3,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {label.toUpperCase()}
      </Text>
      <View 
        style={[
          styles.inputWrapper, 
          { 
            backgroundColor: theme.surface,
            borderColor: isFocused ? theme.brandPrimary : `${theme.border}40`,
            borderWidth: isFocused ? 2 : 1,
            minHeight: multiline ? 100 : 56,
          }
        ]}
      >
        {icon && (
          <View style={styles.iconBox}>
            {React.cloneElement(icon as React.ReactElement<any>, { 
              size: 20, 
              color: isFocused ? theme.brandPrimary : theme.textSecondary 
            })}
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          maxLength={maxLength}
          style={[
            styles.input, 
            { 
              color: theme.textPrimary,
              textAlignVertical: multiline ? 'top' : 'center',
              paddingTop: multiline ? 12 : 0,
            }
          ]}
        />
      </View>
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
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  },
  iconBox: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    height: '100%',
  },
});
