import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Sun, Moon, Monitor, Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import HeaderBar from '@/components/HeaderBar';
import { Card, CardContent } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function ManageThemeScreen() {
  const { theme, themeType, setThemeType } = useTheme();
  const router = useRouter();

  const options = [
    { type: 'light', label: 'Light Mode', description: 'Clean and bright interface', icon: Sun },
    { type: 'dark', label: 'Dark Mode', description: 'Easy on the eyes in the dark', icon: Moon },
    { type: 'system', label: 'System Default', description: 'Follows your device settings', icon: Monitor },
  ] as const;

  const handleApply = () => {
    console.log('Theme applied:', themeType);
    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Appearance"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>SELECT THEME</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Personalize your experience with a theme that fits your style.
          </Text>

          <View style={styles.optionsList}>
            {options.map((opt) => {
              const Icon = opt.icon;
              const isActive = themeType === opt.type;
              return (
                <TouchableOpacity
                  key={opt.type}
                  onPress={() => setThemeType(opt.type)}
                  activeOpacity={0.7}
                  style={styles.optionWrapper}
                >
                  <Card 
                    theme={theme} 
                    style={[
                      styles.themeCard, 
                      { borderColor: isActive ? theme.brandPrimary : 'transparent' },
                      isActive && { backgroundColor: `${theme.brandPrimary}08` }
                    ]}
                  >
                    <CardContent theme={theme} style={styles.cardContent}>
                      <View style={styles.cardLeft}>
                        <View style={[styles.iconBox, { backgroundColor: isActive ? theme.brandPrimary : theme.surface }]}>
                          <Icon size={24} color={isActive ? '#FFF' : theme.textPrimary} />
                        </View>
                        <View>
                          <Text style={[styles.optionLabel, { color: theme.textPrimary }]}>{opt.label}</Text>
                          <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>{opt.description}</Text>
                        </View>
                      </View>
                      {isActive && (
                        <View style={[styles.checkCircle, { backgroundColor: theme.brandPrimary }]}>
                          <Check size={12} color="#FFF" />
                        </View>
                      )}
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* PREVIEW CARD */}
          <View style={styles.previewSection}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>INTERFACE PREVIEW</Text>
            <Card theme={theme} style={styles.previewCard}>
              <CardContent theme={theme} style={styles.previewContent}>
                 <View style={[styles.previewCircle, { backgroundColor: theme.brandPrimary }]} />
                 <View style={styles.previewLines}>
                    <View style={[styles.previewLine, { backgroundColor: theme.textPrimary, width: '80%' }]} />
                    <View style={[styles.previewLine, { backgroundColor: theme.textSecondary, width: '60%', height: 6 }]} />
                 </View>
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          title="Apply Theme"
          theme={theme}
          onPress={handleApply}
        />
      </View>
    </SafeAreaView>
  );
}

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
  sectionLabel: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, marginLeft: 6 },
  sectionSubtitle: { fontSize: 14, fontWeight: '600', marginBottom: 32, lineHeight: 20 },
  optionsList: { gap: 16 },
  optionWrapper: { width: '100%' },
  themeCard: { borderRadius: 24, borderWidth: 1.5 },
  cardContent: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  optionLabel: { fontSize: 16, fontWeight: '800' },
  optionDesc: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  checkCircle: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  previewSection: { marginTop: 40 },
  previewCard: { borderRadius: 24, marginTop: 12, height: 110, justifyContent: 'center' },
  previewContent: { flexDirection: 'row', alignItems: 'center', padding: 24, gap: 16 },
  previewCircle: { width: 48, height: 48, borderRadius: 18 },
  previewLines: { flex: 1, gap: 10 },
  previewLine: { height: 8, borderRadius: 4 },
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
});
