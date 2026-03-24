import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Fingerprint, 
  Lock as LucideLockIcon, 
  ShieldCheck, 
  ChevronRight,
  Timer,
  X,
  Smartphone,
  Trash2,
  LogOut
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import HeaderBar from '@/components/HeaderBar';
import { Card, CardContent } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function ManageSecurityScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [settings, setSettings] = useState({
    biometric: true,
    twoFactor: false,
    autoLock: 'Immediately',
  });

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showAutoLock, setShowAutoLock] = useState(false);
  const autoLockOptions = ['Immediately', 'after 1 Minute', 'after 5 Minutes', 'after 15 Minutes'];

  const performAction = (actionName: string, message: string) => {
    setLoadingAction(message);
    setTimeout(() => {
      setLoadingAction(null);
      if (actionName === 'logout_all') {
        router.replace('/login' as any);
      }
    }, 2000);
  };

  const selectAutoLock = (option: string) => {
    setSettings(prev => ({ ...prev, autoLock: option }));
    setShowAutoLock(false);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Security Center"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* ACCESS CONTROL */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>ACCESS CONTROL</Text>
          <Card theme={theme} style={styles.sectionCard}>
            <CardContent theme={theme} style={styles.cardContent}>
              <SecurityRow 
                theme={theme}
                icon={Fingerprint} 
                title="Biometric Authentication" 
                subtitle="Use FaceID or Fingerprint"
              >
                <Switch
                  value={settings.biometric}
                  onValueChange={(val) => setSettings(prev => ({ ...prev, biometric: val }))}
                  trackColor={{ false: theme.border, true: theme.brandPrimary }}
                  thumbColor="#FFF"
                />
              </SecurityRow>
              <SecurityRow 
                theme={theme} 
                icon={Timer} 
                title="App Auto-lock" 
                subtitle={settings.autoLock}
                isLast
                onClick={() => setShowAutoLock(true)}
              >
                <ChevronRight size={20} color={theme.textSecondary} />
              </SecurityRow>
            </CardContent>
          </Card>

          {/* ACCOUNT PROTECTION */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginTop: 24 }]}>ACCOUNT PROTECTION</Text>
          <Card theme={theme} style={styles.sectionCard}>
            <CardContent theme={theme} style={styles.cardContent}>
              <SecurityRow 
                theme={theme}
                icon={ShieldCheck} 
                title="Two-Factor Auth (2FA)" 
                subtitle={settings.twoFactor ? "Enabled" : "Highly Recommended"}
                onClick={() => performAction('2fa', 'Enabling Two-Factor Authentication...')}
              >
                <ChevronRight size={20} color={theme.textSecondary} />
              </SecurityRow>
              <SecurityRow 
                theme={theme}
                icon={LucideLockIcon} 
                title="Change Security PIN" 
                subtitle="Update your 6-digit PIN"
                isLast
                onClick={() => router.push('/change-pin' as any)}
              >
                <ChevronRight size={20} color={theme.textSecondary} />
              </SecurityRow>
            </CardContent>
          </Card>

          {/* SESSION MANAGEMENT */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary, marginTop: 24 }]}>SESSION MANAGEMENT</Text>
          <Card theme={theme} style={styles.sectionCard}>
            <CardContent theme={theme} style={styles.cardContent}>
              <SecurityRow 
                theme={theme}
                icon={Smartphone} 
                title="Sign out from all devices" 
                subtitle="End all active sessions"
                onClick={() => performAction('logout_all', 'Signing out from all devices...')}
              >
                <ChevronRight size={20} color={theme.textSecondary} />
              </SecurityRow>
              <SecurityRow 
                theme={theme}
                icon={Trash2} 
                title="Delete Account" 
                titleColor="#EF4444"
                subtitle="Permanently remove your data"
                isLast
                onClick={() => performAction('delete', 'Deactivating your account...')}
              >
                <ChevronRight size={20} color={theme.textSecondary} />
              </SecurityRow>
            </CardContent>
          </Card>

          <View style={styles.infoBox}>
             <ShieldCheck size={20} color={theme.brandPrimary} />
             <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Your data is protected with 256-bit AES encryption.
             </Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          title="Done"
          theme={theme}
          onPress={() => router.back()}
        />
      </View>

      {/* AUTO LOCK SELECTION MODAL */}
      <Modal visible={showAutoLock} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Card theme={theme} style={styles.selectionCardModal}>
            <View style={[styles.selectionHeader, { borderBottomColor: `${theme.border}20` }]}>
              <Text style={[styles.selectionTitle, { color: theme.textPrimary }]}>Auto-lock Timeout</Text>
              <TouchableOpacity onPress={() => setShowAutoLock(false)}>
                <X size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
            <View>
              {autoLockOptions.map((opt, i) => (
                <TouchableOpacity 
                  key={opt}
                  onPress={() => selectAutoLock(opt)}
                  style={[
                    styles.selectionRow, 
                    { 
                      borderBottomColor: i === autoLockOptions.length - 1 ? 'transparent' : `${theme.border}20`,
                      backgroundColor: settings.autoLock === opt ? `${theme.brandPrimary}08` : 'transparent'
                    }
                  ]}
                >
                  <Text style={[
                    styles.selectionRowText, 
                    { color: settings.autoLock === opt ? theme.brandPrimary : theme.textPrimary }
                  ]}>
                    {opt}
                  </Text>
                  {settings.autoLock === opt && <ShieldCheck size={18} color={theme.brandPrimary} />}
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </View>
      </Modal>

      {/* ACTION LOADING MODAL */}
      <Modal visible={!!loadingAction} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <Card theme={theme} style={styles.loadingCard}>
            <ActivityIndicator size="large" color={theme.brandPrimary} />
            <Text style={[styles.loadingText, { color: theme.textPrimary }]}>{loadingAction}</Text>
          </Card>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const SecurityRow = ({ theme, icon: Icon, title, subtitle, children, isLast, onClick, titleColor }: any) => (
  <TouchableOpacity
    onPress={onClick}
    activeOpacity={onClick ? 0.7 : 1}
    style={[
      styles.securityRow,
      { borderBottomColor: isLast ? 'transparent' : `${theme.border}20` }
    ]}
  >
    <View style={styles.rowLeft}>
      <View style={[styles.iconBox, { backgroundColor: titleColor === "#EF4444" ? '#EF444410' : `${theme.brandPrimary}08` }]}>
        <Icon size={22} color={titleColor === "#EF4444" ? "#EF4444" : theme.brandPrimary} />
      </View>
      <View>
        <Text style={[styles.rowTitle, { color: titleColor || theme.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
      </View>
    </View>
    {children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 220,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  container: { flex: 1 },
  sectionLabel: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, marginLeft: 4 },
  sectionCard: { borderRadius: 28, overflow: 'hidden', borderWidth: 1.5, borderColor: 'transparent' },
  cardContent: { padding: 0 },
  securityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 15, fontWeight: '800' },
  rowSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 3 },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 40, paddingHorizontal: 16 },
  infoText: { fontSize: 12, fontWeight: '600', flex: 1, lineHeight: 18 },
  footer: { 
    position: 'absolute', 
    bottom: 72, 
    left: 0, 
    right: 0, 
    padding: 24, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    zIndex: 100,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  loadingCard: { padding: 40, borderRadius: 32, alignItems: 'center', gap: 20, width: 280 },
  loadingText: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  selectionCardModal: { padding: 0, borderRadius: 32, width: '100%', maxWidth: 380, overflow: 'hidden' },
  selectionHeader: { padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 },
  selectionTitle: { fontSize: 18, fontWeight: '900' },
  selectionRow: { padding: 20, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 },
  selectionRowText: { fontSize: 16, fontWeight: '700' },
});
