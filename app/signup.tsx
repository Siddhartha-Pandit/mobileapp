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
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartNoAxesCombined, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react-native';

const SignUpScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleSignUp = () => {
    // Add sign-up logic here
    console.log('Sign up pressed');
    router.push('/(tabs)/home' as any); // Navigate to home on success
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
            <View style={[styles.logoContainer, { backgroundColor: theme.brandPrimary, shadowColor: theme.brandPrimary }]}>
              <ChartNoAxesCombined size={28} color="#ffffff" />
            </View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Join Dhukuti today</Text>
          </View>

          {/* Form Card */}
          <View style={[styles.formCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {/* Input Fields */}
            <InputField icon={<User size={18} color={theme.textSecondary}/>} placeholder="Full Name" theme={theme} />
            <InputField icon={<Mail size={18} color={theme.textSecondary}/>} placeholder="Email" type="email-address" theme={theme} />
            <InputField icon={<Phone size={18} color={theme.textSecondary}/>} placeholder="Phone (Optional)" type="phone-pad" theme={theme} />
            <PasswordField 
                icon={<Lock size={18} color={theme.textSecondary}/>} 
                placeholder="Password" 
                theme={theme} 
                show={showPassword} 
                toggle={() => setShowPassword(!showPassword)} 
            />
            <PasswordField 
                icon={<Lock size={18} color={theme.textSecondary}/>} 
                placeholder="Confirm Password" 
                theme={theme} 
                show={showConfirm} 
                toggle={() => setShowConfirm(!showConfirm)} 
            />

            {/* Terms & Conditions */}
            <View style={styles.termsContainer}>
                <Switch
                    value={accepted}
                    onValueChange={setAccepted}
                    trackColor={{ false: theme.border, true: theme.brandPrimary }}
                    thumbColor={theme.surface}
                />
                <Text style={[styles.termsText, { color: theme.textSecondary }]}>
                    I agree to the {' '}
                    <TouchableOpacity onPress={() => router.push('/terms-and-conditions' as any)}><Text style={{color: theme.brandPrimary, fontWeight: '600'}}>Terms & Conditions</Text></TouchableOpacity>
                     and {' '}
                     <TouchableOpacity onPress={() => router.push('/privacy-policy' as any)}><Text style={{color: theme.brandPrimary, fontWeight: '600'}}>Privacy Policy</Text></TouchableOpacity>.
                </Text>
            </View>
            
            <PrimaryButton title="Sign Up" theme={theme} onPress={handleSignUp} fullWidth />
          </View>

          {/* Login Link */}
          <View style={styles.footerContainer}>
            <Text style={{ color: theme.textSecondary }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login' as any)}>
              <Text style={[styles.footerLink, { color: theme.brandPrimary }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const InputField = ({ icon, placeholder, theme, type = 'default' as any }: any) => (
    <View style={[styles.inputFieldContainer, { borderColor: theme.border, backgroundColor: theme.background }]}>
        {icon}
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={theme.textSecondary}
            keyboardType={type}
            style={[styles.input, { color: theme.textPrimary }]} />
    </View>
);

const PasswordField = ({ icon, placeholder, theme, show, toggle }: any) => (
    <View style={[styles.inputFieldContainer, { borderColor: theme.border, backgroundColor: theme.background }]}>
        {icon}
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={theme.textSecondary}
            secureTextEntry={!show}
            style={[styles.input, { color: theme.textPrimary }]} />
        <TouchableOpacity onPress={toggle} style={{padding: 4}}>
            {show ? <EyeOff size={18} color={theme.textSecondary} /> : <Eye size={18} color={theme.textSecondary} />}
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { justifyContent: 'center', padding: 16 },
  headerContainer: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 10 }, elevation: 5 },
  title: { fontSize: 28, fontWeight: '800' },
  subtitle: { marginTop: 6, fontWeight: '500' },
  formCard: { width: '100%', borderRadius: 16, padding: 24, borderWidth: 1 },
  inputFieldContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  input: { flex: 1, fontSize: 14 },
  termsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 16,
      marginBottom: 24,
  },
  termsText: {
      fontSize: 14,
      lineHeight: 18,
      flex: 1,
  },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  footerLink: { fontWeight: '700' },
});

export default SignUpScreen;
