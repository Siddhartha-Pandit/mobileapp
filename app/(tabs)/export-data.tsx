import React, { useState } from 'react';
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
import { FileDown, CheckCircle2, Table, FileText, Calendar } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import HeaderBar from '@/components/HeaderBar';
import { Card, CardContent } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { FormSelect } from '@/components/FormSelect';

export default function ExportDataScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [format, setFormat] = useState('csv');

  const ranges = ['Last 30 Days', 'Last 90 Days', 'This Year', 'All Time'];
  const formats = [
    { label: 'CSV Format', value: 'csv', icon: FileText, desc: 'Best for importing into other apps' },
    { label: 'Excel Format', value: 'xlsx', icon: Table, desc: 'Best for spreadsheets and analysis' },
  ];

  const handleExport = () => {
    console.log('Exporting Data:', { dateRange, format });
    alert('Export started. Your file will be available shortly.');
    router.back();
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Export Data"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>SELECT EXPORT OPTIONS</Text>
          
          <View style={styles.formGroup}>
            <FormSelect
              label="Date Range"
              value={dateRange}
              onSelect={setDateRange}
              options={ranges}
              theme={theme}
              icon={<Calendar />}
            />

            <View style={styles.formatSection}>
              <Text style={[styles.labelSmall, { color: theme.textSecondary, marginBottom: 12 }]}>EXPORT FORMAT</Text>
              <View style={styles.formatList}>
                {formats.map((f) => (
                  <TouchableOpacity
                    key={f.value}
                    onPress={() => setFormat(f.value)}
                    activeOpacity={0.7}
                  >
                    <Card 
                      theme={theme} 
                      style={[
                        styles.formatCard, 
                        { borderColor: format === f.value ? theme.brandPrimary : 'transparent' },
                        format === f.value && { backgroundColor: `${theme.brandPrimary}08` }
                      ]}
                    >
                      <CardContent theme={theme} style={styles.formatContent}>
                        <View style={styles.formatLeft}>
                           <View style={[styles.iconBox, { backgroundColor: format === f.value ? theme.brandPrimary : theme.surface }]}>
                              <f.icon size={22} color={format === f.value ? '#FFF' : theme.textPrimary} />
                           </View>
                           <View>
                              <Text style={[styles.formatLabel, { color: theme.textPrimary }]}>{f.label}</Text>
                              <Text style={[styles.formatDesc, { color: theme.textSecondary }]}>{f.desc}</Text>
                           </View>
                        </View>
                        {format === f.value && <CheckCircle2 size={24} color={theme.brandPrimary} />}
                      </CardContent>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* INFO BOX */}
          <View style={[styles.infoBox, { backgroundColor: `${theme.brandPrimary}08`, borderColor: `${theme.brandPrimary}20` }]}>
             <FileDown size={20} color={theme.brandPrimary} />
             <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Your export will include all transactions, budget details, and category histories for the selected period.
             </Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          title="Generate & Download"
          theme={theme}
          onPress={handleExport}
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
  sectionLabel: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 32, marginLeft: 4 },
  formGroup: { gap: 32 },
  labelSmall: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2, marginLeft: 4 },
  formatSection: { marginTop: 8 },
  formatList: { gap: 14 },
  formatCard: { borderRadius: 26, borderWidth: 1.5 },
  formatContent: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  formatLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  formatLabel: { fontSize: 16, fontWeight: '800' },
  formatDesc: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  infoBox: { flexDirection: 'row', gap: 16, padding: 24, borderRadius: 24, borderWidth: 1, marginTop: 40 },
  infoText: { fontSize: 13, fontWeight: '600', flex: 1, lineHeight: 20 },
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
