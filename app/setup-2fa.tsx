import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck, Mail, Smartphone, AppWindow, CheckCircle2 } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import HeaderBar from '@/components/HeaderBar';
import { Card, CardContent } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function Setup2FAScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [method, setMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const methods = [
    { id: 'app', label: 'Authenticator App', icon: AppWindow, desc: 'Use apps like Google Authenticator', color: '#10B981' },
    { id: 'email', label: 'Email Verification', icon: Mail, desc: 'Get a security code via email', color: '#3B82F6' },
    { id: 'sms', label: 'SMS Verification', icon: Smartphone, desc: 'Get a security code via SMS', color: '#F59E0B' },
  ];

  const handleSetup = () => {
    setLoading(true);
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
          <Text style={[styles.successTitle, { color: theme.textPrimary }]}>2FA Enabled!</Text>
          <Text style={[styles.successSubtitle, { color: theme.textSecondary }]}>
            Your account is now protected with Two-Factor Authentication.
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
        title="Two-Factor Authentication"
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
          <View style={styles.header}>
             <Text style={[styles.title, { color: theme.textPrimary }]}>Choose a Method</Text>
             <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                Select how you'd like to receive your security codes for two-factor authentication.
             </Text>
          </View>

          <View style={styles.methodsList}>
             {methods.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setMethod(m.id)}
                  activeOpacity={0.7}
                >
                  <Card 
                    theme={theme} 
                    style={[
                      styles.methodCard, 
                      method === m.id && { borderColor: theme.brandPrimary, backgroundColor: `${theme.brandPrimary}08` }
                    ]}
                  >
                    <CardContent theme={theme} style={styles.cardContent}>
                       <View style={styles.cardLeft}>
                          <View style={[styles.iconBox, { backgroundColor: method === m.id ? theme.brandPrimary : theme.surface }]}>
                             <m.icon size={22} color={method === m.id ? '#FFF' : theme.textSecondary} />
                          </View>
                          <View>
                             <Text style={[styles.methodLabel, { color: theme.textPrimary }]}>{m.label}</Text>
                             <Text style={[styles.methodDesc, { color: theme.textSecondary }]}>{m.desc}</Text>
                          </View>
                       </View>
                       {method === m.id && <ShieldCheck size={20} color={theme.brandPrimary} />}
                    </CardContent>
                  </Card>
                </TouchableOpacity>
             ))}
          </View>

          <View style={[styles.infoBox, { backgroundColor: `${theme.brandPrimary}10`, borderColor: `${theme.brandPrimary}20` }]}>
             <ShieldCheck size={18} color={theme.brandPrimary} />
             <Text style={[styles.infoText, { color: theme.textPrimary }]}>
                2FA adds an extra layer of security to your account by requiring more than just a password.
             </Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          title="Enable 2FA"
          theme={theme}
          onPress={handleSetup}
          disabled={loading || !method}
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
  header: { marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '900', marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22 },
  methodsList: { gap: 16, marginBottom: 32 },
  methodCard: { borderRadius: 20, borderWidth: 1.5 },
  cardContent: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  methodLabel: { fontSize: 16, fontWeight: '700' },
  methodDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  infoBox: { flexDirection: 'row', gap: 16, padding: 20, borderRadius: 20, borderWidth: 1 },
  infoText: { fontSize: 13, fontWeight: '600', flex: 1, lineHeight: 20 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  successIconBox: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', marginBottom: 12 },
  successSubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22, opacity: 0.8 },
  headerButton: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', bottom: 72, left: 0, right: 0, paddingHorizontal: 24, paddingVertical: 20, borderTopWidth: 1, width: '100%', maxWidth: 500, alignSelf: 'center' },
});
