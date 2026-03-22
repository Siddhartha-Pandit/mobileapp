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
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { useLoadingStore } from '../src/store/useLoadingStore';
import { PrimaryButton } from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet, Eye, EyeOff, Fingerprint, ScanFace } from 'lucide-react-native';
import { GoogleIcon, AppleIcon } from '../components/BrandIcons';

const LoginScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { showLoading, hideLoading } = useLoadingStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    showLoading('Checking credentials...');
    
    // Simulate API call
    setTimeout(() => {
        hideLoading();
        setIsSubmitting(false);
        router.replace('/(tabs)/home');
    }, 1500);
  };

  const handleSocialLogin = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    showLoading('Redirecting to secure login...');
    
    setTimeout(() => {
        hideLoading();
        setIsSubmitting(false);
        router.replace('/(tabs)/home');
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>


      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={[styles.logoContainer, { backgroundColor: theme.brandPrimary, boxShadow: `0px 10px 10px ${theme.brandPrimary}33` }]}>
              <Wallet size={28} color="#ffffff" />
            </View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Dhukuti</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your Financial Companion</Text>
          </View>

          {/* Auth Card */}
          <View style={[styles.authCard, { backgroundColor: theme.surface, borderColor: theme.border, boxShadow: theme.background === '#121212' ? 'none' : '0px 10px 20px rgba(0,0,0,0.08)' }]}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Email Address</Text>
              <TextInput
                placeholder="name@example.com"
                placeholderTextColor={theme.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, { borderColor: theme.border, backgroundColor: theme.background, color: theme.textPrimary }]}
                editable={!isSubmitting}
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textPrimary }]}>Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showPassword}
                  style={[styles.input, { borderColor: theme.border, backgroundColor: theme.background, color: theme.textPrimary, paddingRight: 48 }]}
                  editable={!isSubmitting}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)} disabled={isSubmitting}>
                  {showPassword ? <EyeOff size={20} color={theme.textSecondary} /> : <Eye size={20} color={theme.textSecondary} />}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => router.push('/forgot-password' as any)} disabled={isSubmitting}>
              <Text style={[styles.forgotPassword, { color: theme.brandPrimary }]}>Forgot Password?</Text>
            </TouchableOpacity>

            <PrimaryButton title="Login" theme={theme} onPress={handleLogin} fullWidth disabled={isSubmitting} />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textSecondary }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={handleSocialLogin} disabled={isSubmitting}>
              <GoogleIcon size={22} color={theme.textPrimary} />
              <Text style={[styles.socialButtonText, { color: theme.textPrimary }]}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.textPrimary, borderColor: theme.textPrimary }]} onPress={handleSocialLogin} disabled={isSubmitting}>
              <AppleIcon size={22} color={theme.background} />
              <Text style={[styles.socialButtonText, { color: theme.background }]}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up */}
          <View style={styles.signupContainer}>
            <Text style={{ color: theme.textSecondary, fontWeight: '500' }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/signup' as any)} disabled={isSubmitting}>
              <Text style={[styles.signupText, { color: theme.brandPrimary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Biometric */}
          <View style={styles.biometricContainer}>
            <TouchableOpacity onPress={handleLogin} disabled={isSubmitting}>
                {Platform.OS === 'ios' ? (
                    <ScanFace size={40} color={theme.textSecondary} />
                ) : (
                    <Fingerprint size={40} color={theme.textSecondary} />
                )}
            </TouchableOpacity>
            <Text style={[styles.biometricText, { color: theme.textSecondary }]}>USE BIOMETRICS</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
      color: '#fff',
      marginTop: 16,
      fontSize: 16,
      fontWeight: '600'
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 24,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0px 10px 10px rgba(0,0,0,0.2)', elevation: 5 },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { marginTop: 6, fontWeight: '500' },
  authCard: { 
    width: '100%', 
    maxWidth: 450,
    alignSelf: 'center',
    borderRadius: 16, 
    padding: 24, 
    borderWidth: 1, 
    marginBottom: 32, 
    boxShadow: '0px 10px 20px rgba(0,0,0,0.08)', 
    elevation: 5 
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { width: '100%', height: 52, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, fontSize: 14 },
  passwordInputContainer: { position: 'relative', justifyContent: 'center' },
  eyeIcon: { position: 'absolute', right: 16 },
  forgotPassword: { textAlign: 'right', fontSize: 13, fontWeight: '600', marginBottom: 24 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 12, fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  socialContainer: { 
    width: '100%', 
    maxWidth: 450,
    alignSelf: 'center',
    marginBottom: 24 
  },
  socialButton: { width: '100%', height: 52, borderRadius: 12, borderWidth: 1, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  socialButtonText: { fontWeight: '600', marginLeft: 10 },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  signupText: { marginLeft: 6, fontWeight: '700' },
  biometricContainer: { opacity: 0.6, alignItems: 'center', marginTop: 8 },
  biometricText: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 6 },
});

export default LoginScreen;
