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
  Monitor
} from "lucide-react-native";

// Types & Components
import { useTheme } from "../../hooks/useTheme";
import HeaderBar from "../../components/HeaderBar";
import { SectionHeader } from "../../components/SectionHeader";
import { Card, CardContent } from "../../components/Card";
import type { AppTheme } from "../../constants/theme";

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
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
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
                <SettingRow theme={theme} icon={Timer} title="App Auto-lock" isLast>
                  <Text style={[styles.selectionText, { color: theme.brandPrimary }]}>Immediately</Text>
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
                <SettingRow theme={theme} icon={ShieldCheck} title="Two-Factor Auth" onClick={() => {}}>
                   <View style={styles.rowRight}>
                     <Text style={styles.activeLabel}>ACTIVE</Text>
                     <ChevronRight size={16} color={theme.textSecondary} />
                   </View>
                </SettingRow>
                <SettingRow theme={theme} icon={UserCheck} title="Active Sessions" isLast onClick={() => {}}>
                   <View style={styles.rowRight}>
                     <View style={[styles.sessionBadge, { backgroundColor: theme.brandPrimary }]}>
                       <Text style={styles.sessionBadgeText}>3 DEVICES</Text>
                     </View>
                     <ChevronRight size={16} color={theme.textSecondary} />
                   </View>
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
                <SettingRow theme={theme} icon={LogOut} title="Sign Out All Devices" onClick={() => {}}>
                  <RotateCcw size={16} color={theme.textSecondary} />
                </SettingRow>
                <SettingRow theme={theme} icon={Trash2} title="Delete Account" titleColor="#ef4444" subtitle="Permanently erase all data" isLast onClick={() => {}}>
                  <ChevronRight size={18} color="#ef4444" />
                </SettingRow>
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>
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
});
