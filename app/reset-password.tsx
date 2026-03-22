import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ShieldCheck, Lock, Eye, EyeOff } from 'lucide-react-native';

const ResetPasswordScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = () => {
    if (!password || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match. Please try again.');
      return;
    }
    
    setError('');
    console.log('Password has been reset.');
    Alert.alert(
        'Password Reset',
        'Your password has been successfully updated. Please log in with your new password.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft size={24} color={theme.textPrimary} />
            </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor: theme.brandPrimary + '15', borderColor: theme.brandPrimary + '10'}]}>
                    <ShieldCheck size={56} color={theme.brandPrimary} strokeWidth={1.5} />
                </View>

                {/* Header Text */}
                <View style={styles.headerTextContainer}>
                    <Text style={[styles.title, { color: theme.textPrimary }]}>Reset Password</Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Create a strong new password to secure your account.
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    {/* New Password */}
                    <View style={styles.inputGroup}>
                        <Lock size={18} color={theme.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="New Password"
                            placeholderTextColor={theme.textSecondary}
                            secureTextEntry={!showPassword}
                            style={[styles.input, { borderColor: theme.border, backgroundColor: theme.surface, color: theme.textPrimary }]}
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={18} color={theme.textSecondary} /> : <Eye size={18} color={theme.textSecondary} />}
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputGroup}>
                        <Lock size={18} color={theme.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm New Password"
                            placeholderTextColor={theme.textSecondary}
                            secureTextEntry={!showConfirmPassword}
                            style={[styles.input, { borderColor: theme.border, backgroundColor: theme.surface, color: theme.textPrimary }]}
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff size={18} color={theme.textSecondary} /> : <Eye size={18} color={theme.textSecondary} />}
                        </TouchableOpacity>
                    </View>

                    {/* Error Message */}
                    <View style={styles.errorContainer}>
                        {error && <Text style={styles.errorText}>{error}</Text>}
                    </View>

                    <PrimaryButton title="Reset Password" theme={theme} onPress={handleResetPassword} fullWidth />
                </View>

                 {/* Footer */}
                <View style={styles.footerContainer}>
                    <Text style={{color: theme.textSecondary}}>
                        Remembered your password? {' '}
                    </Text>
                    <TouchableOpacity onPress={() => router.replace('/login') }>
                        <Text style={{ color: theme.brandPrimary, fontWeight: '700' }}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16, flexDirection: 'row', justifyContent: 'flex-start' },
  backButton: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)' },
  scrollContent: { flexGrow: 1, padding: 24, alignItems: 'center', paddingTop: '8%' },
  iconContainer: { width: 120, height: 120, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 32, borderWidth: 1, },
  headerTextContainer: { textAlign: 'center', marginBottom: 32, paddingHorizontal: 16 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, color: 'gray' },
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 16, position: 'relative', justifyContent: 'center' },
  input: { width: '100%', height: 56, paddingLeft: 44, paddingRight: 48, borderRadius: 14, borderWidth: 1, fontSize: 15 },
  inputIcon: { position: 'absolute', left: 14, zIndex: 1 },
  eyeIcon: { position: 'absolute', right: 14, padding: 4 },
  errorContainer: { minHeight: 24, marginBottom: 16, alignItems: 'center' },
  errorText: { color: '#EF4444', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32 }
});

export default ResetPasswordScreen;
