import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Mail } from 'lucide-react-native';
import api from '../src/api/client';

const ForgotPasswordScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.email && typeof params.email === 'string') {
      setEmail(params.email);
    }
  }, [params]);

  const handleSendCode = async () => {
    if (!email) return;
    
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.ok) {
        router.push({ pathname: '/verify-otp', params: { email, flow: 'forgot' } } as any);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send code');
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={[styles.logoContainer, { backgroundColor: theme.brandPrimary, boxShadow: `0px 10px 15px ${theme.brandPrimary}33` }]}>
                <Mail size={32} color="#ffffff" />
                </View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Forgot Your Password?</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                No problem. Enter your email and we'll send you a verification code to reset it.
                </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textPrimary }]}>Email Address</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@example.com"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[styles.input, { borderColor: error ? '#EF4444' : theme.border, backgroundColor: theme.background, color: theme.textPrimary }]}
                />
                {!!error && <Text style={styles.errorText}>{error}</Text>}
                </View>
                <PrimaryButton title="Next" theme={theme} onPress={handleSendCode} isLoading={loading} fullWidth />
            </View>
            </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
  },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 40 },
  headerContainer: { alignItems: 'center', marginBottom: 40, paddingHorizontal: 20 },
  logoContainer: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0px 10px 15px rgba(0,0,0,0.15)', elevation: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontWeight: '500', textAlign: 'center', lineHeight: 22, color: 'gray' },
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { width: '100%', height: 52, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, fontSize: 14 },
  errorText: { color: '#EF4444', fontSize: 12, fontWeight: '600', marginTop: 8, textAlign: 'left' },
});

export default ForgotPasswordScreen;
