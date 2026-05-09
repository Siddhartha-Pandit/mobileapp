import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Lock, Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react-native';
import { useAuthStore } from '../src/store/useAuthStore';
import HeaderBar from '../components/HeaderBar';
import { validatePassword, getPasswordRulesStatus } from '../src/utils/validation';

const ChangePasswordScreen = () => {
  const { theme } = useTheme();
  const isDark = theme.background === '#121212';
  const router = useRouter();
  const { user, changePassword, refreshUser } = useAuthStore();

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPasswords, setShowPasswords] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

  React.useEffect(() => {
    // Ensure we have latest user data
    refreshUser().catch(console.error);
  }, []);

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }
    // Validation
    const passwordCheck = validatePassword(newPassword, user?.fullName);
    if (!passwordCheck.isValid) {
      Alert.alert('Weak Password', passwordCheck.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password changed successfully');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Security & Password"
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <View style={[styles.iconBox, { backgroundColor: theme.brandPrimary + '15' }]}>
                <ShieldCheck size={32} color={theme.brandPrimary} />
            </View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Change Password</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Updating your password regularly helps keep your Dhukuti account and financial data secure.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputLabelRow}>
                <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Current Password</Text>
            </View>
            <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Lock size={18} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                    style={[styles.input, { color: theme.textPrimary }]}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor={theme.textSecondary}
                    secureTextEntry={!showPasswords}
                />
                <TouchableOpacity onPress={() => setShowPasswords(!showPasswords)}>
                    {showPasswords ? <EyeOff size={18} color={theme.textSecondary} /> : <Eye size={18} color={theme.textSecondary} />}
                </TouchableOpacity>
            </View>

            <View style={styles.inputLabelRow}>
                <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>New Password</Text>
            </View>
            <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Lock size={18} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                    style={[styles.input, { color: theme.textPrimary }]}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor={theme.textSecondary}
                    secureTextEntry={!showPasswords}
                />
            </View>

            <View style={styles.inputLabelRow}>
                <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>Confirm New Password</Text>
            </View>
            <View style={[styles.inputGroup, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Lock size={18} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                    style={[styles.input, { color: theme.textPrimary }]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor={theme.textSecondary}
                    secureTextEntry={!showPasswords}
                />
            </View>

            <View style={styles.hintBox}>
                <Text style={[styles.hintText, { color: getPasswordRulesStatus(newPassword, user?.fullName).length ? theme.brandPrimary : theme.textSecondary }]}>
                    • Minimum 8 characters
                </Text>
                <Text style={[styles.hintText, { color: getPasswordRulesStatus(newPassword, user?.fullName).complexity ? theme.brandPrimary : theme.textSecondary }]}>
                    • Include a mix of letters and numbers
                </Text>
                <Text style={[styles.hintText, { color: getPasswordRulesStatus(newPassword, user?.fullName).nameCheck ? theme.brandPrimary : theme.textSecondary }]}>
                    • Avoid using your name or birthdate
                </Text>
            </View>

            <PrimaryButton
                title="Update Password"
                theme={theme}
                onPress={handleChangePassword}
                isLoading={isChangingPassword}
                icon={<KeyRound size={18} color="#FFF" />}
                style={styles.submitBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  backBtn: { padding: 4 },
  scrollContent: { padding: 24 },
  headerSection: { alignItems: 'center', marginBottom: 40 },
  iconBox: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '900', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  form: { marginTop: 10 },
  inputLabelRow: { marginBottom: 8, marginLeft: 4 },
  inputLabel: { fontSize: 14, fontWeight: '700' },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, fontWeight: '600' },
  hintBox: { marginBottom: 30, paddingHorizontal: 8 },
  hintText: { fontSize: 12, lineHeight: 20 },
  submitBtn: { marginTop: 10 },
});

export default ChangePasswordScreen;
