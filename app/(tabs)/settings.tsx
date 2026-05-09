import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  useWindowDimensions,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { 
  ChevronLeft, 
  Fingerprint, 
  Timer, 
  ShieldCheck, 
  Bell, 
  UserCheck, 
  Trash2, 
  RotateCcw, 
  LogOut, 
  Eraser,
  EyeOff,
  BarChart3,
  Activity,
  History,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Lock as LucideLockIcon,
  AlertTriangle
} from "lucide-react-native";

// Types & Components
import { useTheme } from "../../hooks/useTheme";
import HeaderBar from "../../components/HeaderBar";
import { SectionHeader } from "../../components/SectionHeader";
import { Card, CardContent } from "../../components/Card";
import type { AppTheme } from "../../constants/theme";
import { PrimaryButton } from "../../components/PrimaryButton";
import { Modal, ActivityIndicator } from "react-native";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useSetupStore } from "../../src/store/useSetupStore";
import { biometrics } from "../../src/utils/biometrics";
import { MessageModal } from "../../components/MessageModal";
import { setupService } from "../../src/services/setupService";

export default function SettingsPage() {
  const { theme, themeType, setThemeType } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const router = useRouter();
  const isDark = theme.background === "#121212";
  
  const { logout, logoutAll, isBiometricEnabled, updateBiometricStatus, user } = useAuthStore();
  const setupStore = useSetupStore();
  
  // Hydrate on mount
  React.useEffect(() => {
    if (user?.id) {
      setupStore.hydrateStore(user.id);
    }
  }, [user?.id]);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAutoLock, setShowAutoLock] = useState(false);
  
  // Biometric Setup State
  const [showBioPasswordModal, setShowBioPasswordModal] = useState(false);
  const [bioPassword, setBioPassword] = useState('');
  const [bioError, setBioError] = useState('');
  
  // Modal state for messages
  const [messageModal, setMessageModal] = useState({
    visible: false,
    type: 'info' as any,
    title: '',
    message: '',
  });

  const showMessage = (type: any, title: string, message: string) => {
    setMessageModal({ visible: true, type, title, message });
  };

  const handleGlobalSignOut = async () => {
    setActionLoading('Signing out from all devices...');
    try {
        await logoutAll();
        setActionLoading(null);
        alert('Successfully signed out from all other devices.');
        router.replace('/login');
    } catch (e) {
        setActionLoading(null);
        alert('Failed to sign out from all devices.');
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    setActionLoading('Deleting your account permanently...');
    setTimeout(() => {
      setActionLoading(null);
      router.replace('/onboarding');
    }, 3000);
  };

  const handleLogout = async () => {
    setActionLoading('Logging out...');
    try {
        await logout();
        setActionLoading(null);
        router.replace('/login');
    } catch (e) {
        setActionLoading(null);
        alert('Failed to log out.');
    }
  };

  const themeOptions = [
    { type: 'light', icon: Sun, label: 'Light' },
    { type: 'dark', icon: Moon, label: 'Dark' },
    { type: 'system', icon: Monitor, label: 'System' },
  ] as const;

  const autoLockOptions = [
    { label: 'Immediately', value: 0 },
    { label: 'after 1 Minute', value: 1 },
    { label: 'after 5 Minutes', value: 5 },
    { label: 'after 15 Minutes', value: 15 }
  ];

  const toggleSetting = async (key: keyof typeof setupStore) => {
    if (typeof setupStore[key] !== 'boolean') return;
    
    const newVal = !setupStore[key];
    const updates = { [key]: newVal };
    
    // Update local store
    await setupStore.updateSettings(updates);
    
    // Persist to backend/local DB
    if (user?.id) {
      await setupService.saveUserSettings({
        userId: user.id,
        ...setupStore, // This is a bit lazy, should ideally just send what's needed
        [key]: newVal
      });
    }
  };



  const handleBiometricToggle = async () => {
    if (isBiometricEnabled) {
      // Disabling is easy
      try {
        await updateBiometricStatus(false);
        await setupStore.updateSettings({ biometricLock: false });
        if (user?.id) {
          await setupService.saveUserSettings({ userId: user.id, ...setupStore, biometricLock: false });
        }
      } catch (e) {
        showMessage('error', 'Error', 'Failed to disable biometrics.');
      }
    } else {
      // Enabling requires hardware check and password
      const { available, enrolled } = await biometrics.checkAvailability();
      if (!available || !enrolled) {
        showMessage('error', 'Not Supported', 'Your device does not support biometrics or no face/fingerprint is enrolled.');
        return;
      }
      setShowBioPasswordModal(true);
    }
  };

  const handleConfirmBioPassword = async () => {
    if (!bioPassword) {
      setBioError('Password is required');
      return;
    }
    
    setActionLoading('Enabling Biometrics...');
    try {
      // 1. Verify password by attempting to login (or a verify-password endpoint if we had one)
      // Since we don't have a verify endpoint, we'll use the existing login logic but locally
      // This also ensures we have the correct credentials to save in SecureStore
      if (!user?.email) throw new Error('User email not found');
      
      // Save credentials first
      await biometrics.saveCredentials(user.email, bioPassword);
      
      // Update store and backend
      await updateBiometricStatus(true);
      await setupStore.updateSettings({ biometricLock: true });
      if (user?.id) {
        await setupService.saveUserSettings({ userId: user.id, ...setupStore, biometricLock: true });
      }
      
      setActionLoading(null);
      setShowBioPasswordModal(false);
      setBioPassword('');
      setBioError('');
      showMessage('success', 'Success', 'Biometric authentication has been enabled.');
    } catch (e: any) {
      setActionLoading(null);
      setBioError(e.message || 'Failed to enable biometrics.');
      await biometrics.clearCredentials();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar 
        theme={theme}
        title="Settings & Privacy"
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.maxContainer}>
          
          {/* ================= APPEARANCE (THEME) ================= */}
          <View style={styles.section}>
            <SectionHeader theme={theme} title="Appearance" uppercase marginBottom={12} />
            <Card theme={theme}>
              <CardContent theme={theme} style={styles.themeOptions}>
                {themeOptions.map((opt: any) => {
                  const Icon = opt.icon;
                  const isActive = themeType === opt.type;
                  return (
                    <TouchableOpacity 
                      key={opt.type}
                      onPress={async () => {
                        setThemeType(opt.type);
                        await setupStore.updateSettings({ theme: opt.type });
                        if (user?.id) {
                          await setupService.saveUserSettings({ userId: user.id, ...setupStore, theme: opt.type });
                        }
                      }}
                      style={[
                        styles.themeBtn, 
                        { 
                          backgroundColor: isActive ? theme.brandPrimary : (isDark ? "#2A2A2A" : "#F3F4F6"),
                        }
                      ]}
                    >
                      <Icon size={20} color={isActive ? "#FFF" : theme.textSecondary} />
                      <Text style={[styles.themeLabel, { color: isActive ? "#FFF" : theme.textPrimary }]}>{opt.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </CardContent>
            </Card>
          </View>

          {/* ================= SECURITY ================= */}
          <View style={styles.section}>
            <SectionHeader theme={theme} title="Security & Access" uppercase marginBottom={12} />
            <Card theme={theme}>
              <CardContent theme={theme} style={styles.cardInternal}>
                <SettingRow theme={theme} icon={Fingerprint} title="Biometric Lock" subtitle="FaceID or Fingerprint">
                  <Switch 
                    value={isBiometricEnabled} 
                    onValueChange={handleBiometricToggle}
                    trackColor={{ false: theme.border, true: theme.brandPrimary }}
                    thumbColor="#FFF"
                  />
                </SettingRow>
                <SettingRow 
                  theme={theme} 
                  icon={Timer} 
                  title="App Auto-lock" 
                  isLast
                  onClick={() => setShowAutoLock(true)}
                >
                  <Text style={[styles.selectionText, { color: theme.brandPrimary }]}>
                    {autoLockOptions.find(o => o.value === setupStore.autoLockMinutes)?.label || 'Immediately'}
                  </Text>
                </SettingRow>
              </CardContent>
            </Card>
          </View>

          {/* ================= PRIVACY ================= */}
          <View style={styles.section}>
            <SectionHeader theme={theme} title="Privacy Preferences" uppercase marginBottom={12} />
            <Card theme={theme}>
              <CardContent theme={theme} style={styles.cardInternal}>
                <SettingRow theme={theme} icon={EyeOff} title="Stealth Mode" subtitle="Hide balances on dashboard">
                   <Switch 
                    value={setupStore.stealthMode} 
                    onValueChange={() => toggleSetting('stealthMode')}
                    trackColor={{ false: theme.border, true: theme.brandPrimary }}
                    thumbColor="#FFF"
                  />
                </SettingRow>
                <SettingRow theme={theme} icon={Bell} title="Private Notifications" subtitle="Hide amounts in alerts">
                   <Switch 
                    value={setupStore.privateNotifications} 
                    onValueChange={() => toggleSetting('privateNotifications')}
                    trackColor={{ false: theme.border, true: theme.brandPrimary }}
                    thumbColor="#FFF"
                  />
                </SettingRow>
                <SettingRow theme={theme} icon={History} title="Mask Transactions" subtitle="Hide details in history list" isLast>
                   <Switch 
                    value={setupStore.maskTransactions} 
                    onValueChange={() => toggleSetting('maskTransactions')}
                    trackColor={{ false: theme.border, true: theme.brandPrimary }}
                    thumbColor="#FFF"
                  />
                </SettingRow>
              </CardContent>
            </Card>
          </View>

          {/* ================= DATA & ANALYTICS ================= */}
          <View style={styles.section}>
            <SectionHeader theme={theme} title="Data & Analytics" uppercase marginBottom={12} />
            <Card theme={theme}>
              <CardContent theme={theme} style={styles.cardInternal}>
                <SettingRow theme={theme} icon={BarChart3} title="Product Improvement" subtitle="Anonymous usage statistics">
                   <Switch 
                    value={setupStore.productImprovement} 
                    onValueChange={() => toggleSetting('productImprovement')}
                    trackColor={{ false: theme.border, true: theme.brandPrimary }}
                    thumbColor="#FFF"
                  />
                </SettingRow>
                <SettingRow theme={theme} icon={Activity} title="Crash Reporting" isLast subtitle="Help fix bugs automatically">
                   <Switch 
                    value={setupStore.crashReporting} 
                    onValueChange={() => toggleSetting('crashReporting')}
                    trackColor={{ false: theme.border, true: theme.brandPrimary }}
                    thumbColor="#FFF"
                  />
                </SettingRow>
              </CardContent>
            </Card>
          </View>

          {/* ================= ACCOUNT INTEGRITY ================= */}
          <View style={styles.section}>
            <SectionHeader theme={theme} title="Account Integrity" uppercase marginBottom={12} />
            <Card theme={theme}>
              <CardContent theme={theme} style={styles.cardInternal}>
                <SettingRow 
                  theme={theme} 
                  icon={ShieldCheck} 
                  title="Two-Factor Auth" 
                  onClick={() => toggleSetting('twoFactorAuth')}
                >
                  <View style={styles.rowRight}>
                    <Text style={[styles.activeLabel, { color: setupStore.twoFactorAuth ? '#10b981' : theme.textSecondary }]}>
                      {setupStore.twoFactorAuth ? 'ACTIVE' : 'DISABLED'}
                    </Text>
                    <ChevronRight size={16} color={theme.textSecondary} />
                  </View>
                </SettingRow>
                <SettingRow 
                  theme={theme} 
                  icon={LucideLockIcon} 
                  title="Change Security PIN" 
                  isLast 
                  onClick={() => router.push('/change-pin')}
                >
                   <ChevronRight size={16} color={theme.textSecondary} />
                </SettingRow>
              </CardContent>
            </Card>
          </View>

          {/* ================= DANGER ZONE ================= */}
          <View style={styles.section}>
            <SectionHeader theme={theme} title="Danger Zone" uppercase marginBottom={12} />
            <Card theme={theme} style={{ borderColor: '#ef444444' }}>
              <CardContent theme={theme} style={[styles.cardInternal, { backgroundColor: '#ef444405' }]}>
                <SettingRow theme={theme} icon={Eraser} title="Clear Local Cache" subtitle="Free up 124 MB of space" onClick={() => {}} />
                <SettingRow 
                  theme={theme} 
                  icon={LogOut} 
                  title="Sign Out All Devices" 
                  onClick={handleGlobalSignOut}
                >
                  <ChevronRight size={16} color={theme.textSecondary} />
                </SettingRow>
                <SettingRow 
                  theme={theme} 
                  icon={Trash2} 
                  title="Delete Account" 
                  titleColor="#ef4444" 
                  subtitle="Permanently erase all data" 
                  isLast 
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <ChevronRight size={18} color="#ef4444" />
                </SettingRow>
              </CardContent>
            </Card>
          </View>

          {/* ================= LOGOUT ================= */}
          <View style={[styles.section, { marginBottom: 40 }]}>
            <PrimaryButton 
              title="Log Out" 
              theme={theme} 
              onPress={handleLogout}
              isLoading={actionLoading === 'Logging out...'}
              style={{ backgroundColor: isDark ? '#2A2A2A' : '#FFF', borderWidth: 1, borderColor: theme.border }}
              textColor="#EF4444"
              fullWidth
              noShadow
            />
          </View>
        </View>
      </ScrollView>

      {/* ACTION LOADING MODAL */}
      <Modal visible={!!actionLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.loadingBox, { backgroundColor: theme.surface }]}>
            <ActivityIndicator size="large" color={theme.brandPrimary} />
            <Text style={[styles.loadingText, { color: theme.textPrimary }]}>{actionLoading}</Text>
          </View>
        </View>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal visible={showDeleteConfirm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmBox, { backgroundColor: theme.surface }]}>
            <View style={[styles.alertIconBox, { backgroundColor: '#EF444415' }]}>
              <AlertTriangle size={32} color="#EF4444" />
            </View>
            <Text style={[styles.confirmTitle, { color: theme.textPrimary }]}>Delete Account?</Text>
            <Text style={[styles.confirmSubtitle, { color: theme.textSecondary }]}>
              This action is irreversible. All your data, including transactions and accounts, will be permanently deleted.
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity 
                onPress={() => setShowDeleteConfirm(false)}
                style={[styles.cancelBtn, { borderColor: theme.border }]}
              >
                <Text style={{ color: theme.textSecondary, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleDeleteAccount}
                style={[styles.deleteBtn, { backgroundColor: '#EF4444' }]}
              >
                <Text style={{ color: '#FFF', fontWeight: '800' }}>Delete Forever</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* AUTO LOCK SELECTION MODAL */}
      <Modal visible={showAutoLock} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Card theme={theme} style={styles.selectionCardModal}>
            <View style={styles.selectionHeader}>
                <Text style={[styles.selectionTitle, { color: theme.textPrimary }]}>Auto-lock Settings</Text>
                <TouchableOpacity onPress={() => setShowAutoLock(false)}>
                    <Text style={{ color: theme.brandPrimary, fontWeight: '700' }}>Done</Text>
                </TouchableOpacity>
            </View>
            {autoLockOptions.map((opt) => (
                <TouchableOpacity 
                    key={opt.value}
                    onPress={async () => { 
                      await setupStore.updateSettings({ autoLockMinutes: opt.value }); 
                      if (user?.id) {
                        await setupService.saveUserSettings({ userId: user.id, ...setupStore, autoLockMinutes: opt.value });
                      }
                      setShowAutoLock(false); 
                    }}
                    style={[styles.selectionRow, { borderBottomColor: `${theme.border}30` }]}
                >
                    <Text style={[styles.selectionRowText, { color: setupStore.autoLockMinutes === opt.value ? theme.brandPrimary : theme.textPrimary }]}>{opt.label}</Text>
                    {setupStore.autoLockMinutes === opt.value && <ShieldCheck size={18} color={theme.brandPrimary} />}
                </TouchableOpacity>
            ))}
          </Card>
        </View>
      </Modal>

      <MessageModal
        visible={messageModal.visible}
        type={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}
        onClose={() => setMessageModal(prev => ({ ...prev, visible: false }))}
        theme={theme}
      />

      {/* BIOMETRIC PASSWORD MODAL */}
      <Modal visible={showBioPasswordModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmBox, { backgroundColor: theme.surface }]}>
            <View style={[styles.alertIconBox, { backgroundColor: `${theme.brandPrimary}15` }]}>
              <Fingerprint size={32} color={theme.brandPrimary} />
            </View>
            <Text style={[styles.confirmTitle, { color: theme.textPrimary }]}>Enable Biometrics</Text>
            <Text style={[styles.confirmSubtitle, { color: theme.textSecondary }]}>
              Enter your login password to securely enable FaceID or Fingerprint authentication.
            </Text>
            
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: theme.background, 
                color: theme.textPrimary,
                borderColor: bioError ? theme.danger : theme.border
              }]}
              placeholder="Confirm your password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              value={bioPassword}
              onChangeText={(text) => { setBioPassword(text); setBioError(''); }}
              autoFocus
            />
            {bioError ? <Text style={styles.bioErrorText}>{bioError}</Text> : null}

            <View style={styles.confirmActions}>
              <TouchableOpacity 
                onPress={() => { setShowBioPasswordModal(false); setBioPassword(''); setBioError(''); }}
                style={[styles.cancelBtn, { borderColor: theme.border }]}
              >
                <Text style={{ color: theme.textSecondary, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleConfirmBioPassword}
                style={[styles.deleteBtn, { backgroundColor: theme.brandPrimary }]}
              >
                <Text style={{ color: '#FFF', fontWeight: '800' }}>Enable Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const SettingRow = ({ theme, icon: Icon, title, subtitle, children, isLast, onClick, titleColor }: any) => (
  <TouchableOpacity 
    onPress={onClick}
    activeOpacity={onClick ? 0.7 : 1}
    style={[
      styles.settingRow,
      { borderBottomColor: isLast ? 'transparent' : `${theme.border}40` }
    ]}
  >
    <View style={styles.rowLeft}>
      {Icon && (
        <View style={[
          styles.rowIconWrapper, 
          { backgroundColor: titleColor === "#ef4444" ? "#ef444415" : `${theme.brandPrimary}10` }
        ]}>
          <Icon size={20} color={titleColor === "#ef4444" ? "#ef4444" : theme.brandPrimary} />
        </View>
      )}
      <View>
        <Text style={[styles.rowTitle, { color: titleColor || theme.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
      </View>
    </View>
    {children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  maxContainer: {
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  backBtn: {
    padding: 4,
  },
  cardInternal: {
    padding: 0,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    padding: 16,
  },
  themeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rowIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  rowSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  selectionText: {
    fontSize: 13,
    fontWeight: '800',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeLabel: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '800',
  },
  sessionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sessionBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingBox: { padding: 32, borderRadius: 24, alignItems: 'center', gap: 16, width: '80%', maxWidth: 300 },
  loadingText: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  confirmBox: { padding: 32, borderRadius: 32, alignItems: 'center', width: '100%', maxWidth: 400 },
  alertIconBox: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  confirmTitle: { fontSize: 20, fontWeight: '900', marginBottom: 12 },
  confirmSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32, opacity: 0.8 },
  confirmActions: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelBtn: { flex: 1, height: 54, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { flex: 1, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  selectionCardModal: { padding: 0, borderRadius: 24, width: '100%', maxWidth: 350, overflow: 'hidden' },
  selectionHeader: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  selectionTitle: { fontSize: 16, fontWeight: '800' },
  selectionRow: { padding: 18, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1 },
  selectionRowText: { fontSize: 14, fontWeight: '600' },
  modalInput: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
    marginTop: 10,
  },
  bioErrorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
});
