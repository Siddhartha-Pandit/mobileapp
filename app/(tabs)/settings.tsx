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

export default function SettingsPage() {
  const { theme, themeType, setThemeType } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const router = useRouter();
  const isDark = theme.background === "#121212";
  
  const [settings, setSettings] = useState({
    biometric: true,
    hideBalance: false,
    hideNotifications: true,
    hideTransactions: false,
    analytics: true,
    crashReports: true,
    autoLock: 'Immediately',
  });

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAutoLock, setShowAutoLock] = useState(false);

  const autoLockOptions = ['Immediately', 'after 1 Minute', 'after 5 Minutes', 'after 15 Minutes'];

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGlobalSignOut = () => {
    setActionLoading('Signing out from all devices...');
    setTimeout(() => {
      setActionLoading(null);
      alert('Successfully signed out from all other devices.');
    }, 2000);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    setActionLoading('Deleting your account permanently...');
    setTimeout(() => {
      setActionLoading(null);
      router.replace('/onboarding');
    }, 3000);
  };

  const handleLogout = () => {
    setActionLoading('Logging out...');
    setTimeout(() => {
      setActionLoading(null);
      router.replace('/onboarding');
    }, 1500);
  };

  const themeOptions = [
    { type: 'light', icon: Sun, label: 'Light' },
    { type: 'dark', icon: Moon, label: 'Dark' },
    { type: 'system', icon: Monitor, label: 'System' },
  ] as const;

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
                {themeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = themeType === opt.type;
                  return (
                    <TouchableOpacity 
                      key={opt.type}
                      onPress={() => setThemeType(opt.type)}
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
                    value={settings.biometric} 
                    onValueChange={() => toggleSetting('biometric')}
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
                  <Text style={[styles.selectionText, { color: theme.brandPrimary }]}>{settings.autoLock}</Text>
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
                    value={settings.hideBalance} 
                    onValueChange={() => toggleSetting('hideBalance')}
                    trackColor={{ false: theme.border, true: theme.brandPrimary }}
                    thumbColor="#FFF"
                  />
                </SettingRow>
                <SettingRow theme={theme} icon={Bell} title="Private Notifications" subtitle="Hide amounts in alerts">
                   <Switch 
                    value={settings.hideNotifications} 
                    onValueChange={() => toggleSetting('hideNotifications')}
                    trackColor={{ false: theme.border, true: theme.brandPrimary }}
                    thumbColor="#FFF"
                  />
                </SettingRow>
                <SettingRow theme={theme} icon={History} title="Mask Transactions" subtitle="Hide details in history list" isLast>
                   <Switch 
                    value={settings.hideTransactions} 
                    onValueChange={() => toggleSetting('hideTransactions')}
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
                    value={settings.analytics} 
                    onValueChange={() => toggleSetting('analytics')}
                    trackColor={{ false: theme.border, true: theme.brandPrimary }}
                    thumbColor="#FFF"
                  />
                </SettingRow>
                <SettingRow theme={theme} icon={Activity} title="Crash Reporting" isLast subtitle="Help fix bugs automatically">
                   <Switch 
                    value={settings.crashReports} 
                    onValueChange={() => toggleSetting('crashReports')}
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
                  onClick={() => router.push('/setup-2fa')}
                >
                  <View style={styles.rowRight}>
                    <Text style={styles.activeLabel}>ACTIVE</Text>
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
                    key={opt}
                    onPress={() => { setSettings(s => ({ ...s, autoLock: opt })); setShowAutoLock(false); }}
                    style={[styles.selectionRow, { borderBottomColor: `${theme.border}30` }]}
                >
                    <Text style={[styles.selectionRowText, { color: settings.autoLock === opt ? theme.brandPrimary : theme.textPrimary }]}>{opt}</Text>
                    {settings.autoLock === opt && <ShieldCheck size={18} color={theme.brandPrimary} />}
                </TouchableOpacity>
            ))}
          </Card>
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
});
