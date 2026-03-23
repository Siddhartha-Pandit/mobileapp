import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Lock, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import HeaderBar from '@/components/HeaderBar';
import { Card, CardContent } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function ChangePinScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = () => {
    if (newPin !== confirmPin) {
      alert('Pins do not match!');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.successContainer}>
          <View style={[styles.successIconBox, { backgroundColor: `${theme.brandPrimary}15` }]}>
            <CheckCircle2 size={64} color={theme.brandPrimary} />
          </View>
          <Text style={[styles.successTitle, { color: theme.textPrimary }]}>PIN Updated Successfully!</Text>
          <Text style={[styles.successSubtitle, { color: theme.textSecondary }]}>
            Your security PIN has been changed. Use your new PIN for future access.
          </Text>
          <View style={{ width: '100%', maxWidth: 300, marginTop: 40 }}>
            <PrimaryButton
              title="Return to Security"
              theme={theme}
              onPress={() => router.back()}
              fullWidth
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Change Security PIN"
        leftContent={
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.headerButton, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}
          >
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.infoBox}>
             <View style={[styles.iconBox, { backgroundColor: `${theme.brandPrimary}10` }]}>
                <Lock size={20} color={theme.brandPrimary} />
             </View>
             <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Create a strong PIN to keep your financial data secure. Avoid using common patterns like '1234'.
             </Text>
          </View>

          <View style={styles.form}>
             <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Current PIN</Text>
                <TextInput
                  value={currentPin}
                  onChangeText={setCurrentPin}
                  placeholder="••••"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                  style={[styles.input, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.surface }]}
                />
             </View>

             <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>New PIN</Text>
                <TextInput
                  value={newPin}
                  onChangeText={setNewPin}
                  placeholder="••••"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                  style={[styles.input, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.surface }]}
                />
             </View>

             <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Confirm New PIN</Text>
                <TextInput
                  value={confirmPin}
                  onChangeText={setConfirmPin}
                  placeholder="••••"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                  style={[styles.input, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.surface }]}
                />
             </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          title="Update PIN"
          theme={theme}
          onPress={handleUpdate}
          disabled={loading || !currentPin || !newPin || !confirmPin}
          fullWidth
          isLoading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  container: { padding: 24 },
  infoBox: { flexDirection: 'row', gap: 16, marginBottom: 32, alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  infoText: { fontSize: 13, fontWeight: '500', flex: 1, lineHeight: 18 },
  form: { gap: 24 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  input: { height: 56, borderRadius: 16, borderWidth: 1.5, paddingHorizontal: 20, fontSize: 24, fontWeight: '700', letterSpacing: 10, textAlign: 'center' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  successIconBox: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 12 },
  successSubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, opacity: 0.8 },
  headerButton: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', bottom: 72, left: 0, right: 0, paddingHorizontal: 24, paddingVertical: 20, borderTopWidth: 1, width: '100%', maxWidth: 500, alignSelf: 'center' },
});
