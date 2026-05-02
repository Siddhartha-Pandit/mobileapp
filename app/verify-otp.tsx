import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Lock } from 'lucide-react-native';
import { useAuthStore } from '../src/store/useAuthStore';
import { useLoadingStore } from '../src/store/useLoadingStore';

const CODE_LENGTH = 6;

const VerifyOtpScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string || '';

  const [otp, setOtp] = useState<string[]>(new Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const inputsRef = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (resendCooldown > 0) setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const flow = params.flow as string || 'forgot';
  const verifyAuthOtp = useAuthStore(state => state.verifyOtp);
  const resendAuthOtp = useAuthStore(state => state.resendOtp);
  const { showLoading, hideLoading } = useLoadingStore();

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    setError('');
    
    if (enteredOtp.length !== CODE_LENGTH) {
      setError('Please enter a 6-digit code.');
      return;
    }

    showLoading('Verifying code...');
    try {
        if (flow === 'signup') {
            await verifyAuthOtp(email, enteredOtp);
            hideLoading();
            router.replace('/currency-setup' as any);
        } else {
            // Handle forgot password flow here later
            hideLoading();
            router.push('/reset-password' as any);
        }
    } catch (e: any) {
        hideLoading();
        setError(e.message || 'Invalid code. Please check and try again.');
    }
  };

  const handleResend = async () => {
    if (resendCooldown === 0) {
      showLoading('Sending new code...');
      try {
          await resendAuthOtp(email);
          hideLoading();
          setResendCooldown(60);
          setOtp(new Array(CODE_LENGTH).fill(''));
          inputsRef.current[0]?.focus();
      } catch (e: any) {
          hideLoading();
          setError(e.message || 'Failed to resend code');
      }
    }
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Icon with Glow */}
          <View style={[
              styles.iconContainer, 
              { 
                  backgroundColor: '#1A1A1A', 
                  borderColor: theme.brandPrimary + '20',
                  boxShadow: `0 10px 30px ${theme.brandPrimary}20`,
              }
          ]}>
              <Lock size={48} color={theme.brandPrimary} strokeWidth={1.5} />
          </View>

          {/* Header Text */}
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Check Your Email</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              We've sent a 6-digit confirmation code to your inbox. Please enter it below to continue.
            </Text>
          </View>

          {/* OTP Input Fields */}
          <View style={styles.codeContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => { inputsRef.current[index] = ref; }}
                style={[
                    styles.digitInput,
                    { 
                        borderColor: error 
                            ? '#EF4444' 
                            : focusedIndex === index 
                                ? theme.brandPrimary 
                                : theme.border,
                        backgroundColor: '#1A1A1A',
                        color: theme.textPrimary,
                        boxShadow: focusedIndex === index ? `0 0 0 2px ${theme.brandPrimary}30` : 'none',
                    }
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={(e) => handleKeyDown(e, index)}
              />
            ))}
          </View>

          {/* Error Message */}
          <View style={styles.errorContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* Verify Button */}
          <View style={styles.buttonWrapper}>
            <PrimaryButton title="Verify Code" theme={theme} onPress={handleVerify} fullWidth />
          </View>

          {/* Resend Logic */}
          <View style={styles.resendContainer}>
              {resendCooldown > 0 ? (
                  <Text style={[styles.resendText, { color: theme.textSecondary }]}>
                      Resend code in <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>{resendCooldown}s</Text>
                  </Text>
              ) : (
                <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
                    <Text style={[styles.resendLink, { color: theme.brandPrimary }]}>Resend New Code</Text>
                </TouchableOpacity>
              )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16 },
  backButton: { 
      padding: 10, 
      alignSelf: 'flex-start' 
  },
  scrollContent: { 
      flexGrow: 1, 
      paddingHorizontal: 24, 
      alignItems: 'center', 
      paddingTop: '8%',
      paddingBottom: 40,
  },
  iconContainer: { 
      width: 110, 
      height: 110, 
      borderRadius: 32, 
      alignItems: 'center', 
      justifyContent: 'center', 
      marginBottom: 40, 
      borderWidth: 1, 
  },
  headerTextContainer: { width: '100%', marginBottom: 40 },
  title: { 
      fontSize: 28, 
      fontWeight: '800', 
      textAlign: 'center', 
      marginBottom: 16, 
      letterSpacing: -0.5 
  },
  subtitle: { 
      fontSize: 15, 
      textAlign: 'center', 
      lineHeight: 24, 
      paddingHorizontal: 20,
  },
  codeContainer: { 
      flexDirection: 'row', 
      justifyContent: 'center', 
      width: '100%', 
      marginBottom: 40, 
      gap: 10 
  },
  digitInput: { 
      width: '14%',
      height: 60, 
      textAlign: 'center',
      fontSize: 22,
      fontWeight: '700',
      borderRadius: 12,
      borderWidth: 1.5,
  },
  errorContainer: { minHeight: 24, marginBottom: 16 },
  errorText: { color: '#EF4444', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  buttonWrapper: { width: '100%', marginBottom: 32 },
  resendContainer: { alignItems: 'center' },
  resendText: { fontSize: 15 },
  resendButton: { padding: 4 },
  resendLink: { fontWeight: '700', textDecorationLine: 'underline', fontSize: 15 },
});

export default VerifyOtpScreen;
