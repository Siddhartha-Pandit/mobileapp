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
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet, Building2, FileText, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { StepProgress } from '../components/StepProgress';
import { PrimaryButton } from '../components/PrimaryButton';
import { ColorPicker } from '../components/ColorPicker';
import { SelectField } from '../components/SelectField';

export default function CreateAccountScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [balance, setBalance] = useState('');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState('#1152d4');

  const colors = [
    '#1152d4',
    '#10b981',
    '#ef4444',
    '#f97316',
    '#7c3aed',
    '#ec4899',
    '#f59e0b',
  ];

  const accountTypes = [
    'Checking / Current',
    'Savings',
    'Credit Card',
    'Cash',
  ];

  const handleContinue = () => {
    console.log('Account Created:', { accountName, accountType, balance, color, notes });
    router.push('/expense-category');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header / Progress */}
          <StepProgress
            theme={theme}
            step={2}
            totalSteps={4}
            title="Create Account"
            subtitle="Add your primary account to start"
          />

          <View style={styles.formContainer}>
            {/* Account Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Account Name</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Wallet size={18} color={theme.brandPrimary} style={styles.icon} />
                <TextInput
                  value={accountName}
                  onChangeText={setAccountName}
                  placeholder="e.g. Daily Expenses"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { color: theme.textPrimary }]}
                />
              </View>
            </View>

            {/* Account Type */}
            <View style={styles.inputGroup}>
              <SelectField
                theme={theme}
                label="Account Type"
                icon={<Building2 size={18} color={theme.textSecondary} />}
                value={accountType}
                options={accountTypes}
                onChange={setAccountType}
              />
            </View>

            {/* Initial Balance */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Initial Balance</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.currencySymbol, { color: theme.textPrimary }]}>₨</Text>
                <TextInput
                  value={balance}
                  onChangeText={setBalance}
                  placeholder="0.00"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="decimal-pad"
                  style={[
                    styles.input,
                    { color: theme.textPrimary, fontSize: 20, fontWeight: '700' },
                  ]}
                />
              </View>
            </View>

            {/* Theme Color */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Theme Color</Text>
              <View
                style={[
                  styles.colorPickerContainer,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <ColorPicker
                  theme={theme}
                  colors={colors}
                  selected={color}
                  onChange={setColor}
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                Notes (Optional)
              </Text>
              <View
                style={[
                  styles.textAreaWrapper,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              >
                <FileText size={18} color={theme.textSecondary} style={styles.textAreaIcon} />
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Details about this account..."
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={4}
                  style={[styles.textArea, { color: theme.textPrimary }]}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Fixed Bottom Action Bar */}
        <View style={[styles.footer, { borderTopColor: `${theme.border}40` }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { borderColor: theme.border }]}
          >
            <Text style={[styles.backButtonText, { color: theme.textPrimary }]}>Back</Text>
          </TouchableOpacity>
          <View style={{ flex: 2 }}>
            <PrimaryButton
              title="Continue"
              theme={theme}
              onPress={handleContinue}
              fullWidth
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100, // Space for fixed footer
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingLeft: 4,
  },
  inputWrapper: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '800',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  colorPickerContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  textAreaWrapper: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    minHeight: 120,
  },
  textAreaIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    textAlignVertical: 'top',
    paddingTop: 0,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 0 : 24,
    gap: 12,
    borderTopWidth: 1,
  },
  backButton: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
