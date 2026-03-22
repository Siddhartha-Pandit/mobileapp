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

const CODE_LENGTH = 6;

const VerifyOtpScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string || '';

  const [otp, setOtp] = useState(new Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);
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

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    setError('');
    if (enteredOtp.length !== CODE_LENGTH || enteredOtp !== '123456') { // Demo logic
      setError('Invalid code. Please check and try again.');
      return;
    }
    console.log('Verifying OTP:', enteredOtp);
    router.push('/reset-password' as any);
  };

  const handleResend = () => {
    if (resendCooldown === 0) {
      console.log('Resending OTP...');
      setResendCooldown(60);
      setOtp(new Array(CODE_LENGTH).fill(''));
      inputsRef.current[0]?.focus();
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: theme.brandPrimary + '15', borderColor: theme.brandPrimary + '10'}]}>
              <Lock size={56} color={theme.brandPrimary} strokeWidth={1.5} />
          </View>

          {/* Header Text */}
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Check Your Email</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              We've sent a 6-digit confirmation code to your inbox. Please enter it below to continue.
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.codeContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => { inputsRef.current[index] = ref; }}
                style={[
                    styles.digitInput,
                    { 
                        borderColor: error ? '#EF4444' : theme.border,
                        backgroundColor: theme.surface,
                        color: theme.textPrimary
                    }
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleChange(value, index)}
                onKeyPress={(e) => handleKeyDown(e, index)}
              />
            ))}
          </View>

          {/* Error Area */}
          <View style={styles.errorContainer}>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* Verify Button */}
          <View style={{width: '100%', marginBottom: 32}}>
            <PrimaryButton title="Verify Code" theme={theme} onPress={handleVerify} fullWidth />
          </View>

          {/* Resend Footer */}
          <View style={styles.resendContainer}>
              {resendCooldown > 0 ? (
                  <Text style={{color: theme.textSecondary}}>
                      Resend code in <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>{resendCooldown}s</Text>
                  </Text>
              ) : (
                <TouchableOpacity onPress={handleResend} style={{padding: 4}}>
                    <Text style={{ color: theme.brandPrimary, fontWeight: '700', textDecorationLine: 'underline' }}>Resend New Code</Text>
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
  header: { paddingHorizontal: 16, paddingTop: 16, flexDirection: 'row', justifyContent: 'flex-start' },
  backButton: { padding: 8, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)' },
  scrollContent: { flexGrow: 1, padding: 24, alignItems: 'center', paddingTop: '8%' },
  iconContainer: { width: 120, height: 120, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 32, borderWidth: 1, },
  headerTextContainer: { textAlign: 'center', marginBottom: 40, paddingHorizontal: 16 },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, color: 'gray' },
  codeContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16, gap: 8 },
  digitInput: { 
      flex: 1,
      height: 60, 
      textAlign: 'center',
      fontSize: 22,
      fontWeight: '700',
      borderRadius: 12,
      borderWidth: 2,
  },
  errorContainer: { minHeight: 24, marginBottom: 16, alignItems: 'center' },
  errorText: { color: '#EF4444', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});

export default VerifyOtpScreen;
