import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, SlidersHorizontal, LayoutList } from 'lucide-react-native';

import HeaderBar from '../../components/HeaderBar';
import { StockTable, type Stock } from '../../components/StockTable';
import { useTheme } from '../../hooks/useTheme';
import { CustomTabs } from '../../components/CustomTabs';

export default function DhukutiScreener() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'filters' | 'list'>('filters');
  const [activeSector, setActiveSector] = useState('Commercial Banks');

  // MultiRangeSlider requires specific native packages, so for this boilerplate we mock static ranges.
  const [peRange, setPeRange] = useState({ min: 5, max: 25 });

  const stocks: Stock[] = [
    { symbol: 'NABIL', name: 'Nabil Bank Ltd.', price: '945.00', change: '+1.25%', pe: '18.4', pb: '3.2', roe: '16.5%' },
    { symbol: 'NMB', name: 'NMB Bank Limited', price: '312.00', change: '-0.42%', pe: '12.1', pb: '1.4', roe: '11.2%' },
    { symbol: 'EBL', name: 'Everest Bank', price: '610.00', change: '+0.88%', pe: '15.2', pb: '2.1', roe: '14.8%' },
    { symbol: 'HRL', name: 'Himalayan Re', price: '640.00', change: '+3.12%', pe: '42.1', pb: '5.6', roe: '12.4%' },
    { symbol: 'NICL', name: 'NIC Asia Insurance', price: '720.00', change: '-1.15%', pe: '22.4', pb: '4.1', roe: '10.9%' },
    { symbol: 'SCB', name: 'Standard Chartered', price: '520.00', change: '+0.15%', pe: '14.2', pb: '2.5', roe: '13.1%' },
  ];

  const SectionLabel = ({ text }: { text: string }) => (
    <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{text}</Text>
  );

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <HeaderBar
        theme={theme}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        title={<Text style={[styles.title, { color: theme.textPrimary }]}>Screener</Text>}
        rightContent={
          <TouchableOpacity style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <Search size={18} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />
      
      {/* TABS */}
      <View style={{ backgroundColor: theme.surface, borderBottomWidth: 1, borderBottomColor: `${theme.border}40` }}>
        <CustomTabs 
          theme={theme}
          options={[
            { value: "filters", label: "FILTERS" },
            { value: "list", label: "STOCK LIST" }
          ]}
          activeTab={activeTab}
          onChange={(val) => setActiveTab(val as any)}
        />
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ paddingBottom: 160, maxWidth: 500, alignSelf: 'center', width: '100%' }}>
        {activeTab === 'filters' ? (
          <View style={{ padding: 20 }}>
            <SectionLabel text="Sector" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 10 }}>
              {['Commercial Banks', 'Hydropower', 'Finance', 'Insurance'].map(s => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setActiveSector(s)}
                  style={[
                    styles.sectorBtn,
                    { 
                      borderColor: activeSector === s ? theme.brandPrimary : theme.border,
                      backgroundColor: activeSector === s ? `${theme.brandPrimary}15` : theme.surface 
                    }
                  ]}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: activeSector === s ? theme.brandPrimary : theme.textSecondary }}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <SectionLabel text="Valuation" />
            {/* Mocked Multi-Range Sliders for RN - replacing input[type=range] */}
            <View style={[styles.rangeCard, { backgroundColor: theme.surface, borderColor: `${theme.border}80` }]}>
              <View style={styles.rangeHeader}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>P/E Ratio</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: theme.brandPrimary }}>5 — 25</Text>
              </View>
              <View style={[styles.rangeTrack, { backgroundColor: theme.border }]}>
                 <View style={[styles.rangeFill, { backgroundColor: theme.brandPrimary, left: '5%', right: '75%' }]} />
              </View>
            </View>

            <View style={[styles.rangeCard, { backgroundColor: theme.surface, borderColor: `${theme.border}80` }]}>
              <View style={styles.rangeHeader}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>ROE %</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: theme.brandPrimary }}>10 — 30</Text>
              </View>
              <View style={[styles.rangeTrack, { backgroundColor: theme.border }]}>
                 <View style={[styles.rangeFill, { backgroundColor: theme.brandPrimary, left: '20%', right: '40%' }]} />
              </View>
            </View>

          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
             <StockTable theme={theme} stocks={stocks} />
          </View>
        )}
      </ScrollView>

      {/* FLOATING ACTION */}
      <View style={styles.floatingAction}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.brandPrimary, shadowColor: theme.brandPrimary }]}>
          <Text style={styles.actionBtnText}>
            {activeTab === 'filters' ? `Show ${stocks.length} Matching Stocks` : 'Update NEPSE Data'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  iconBtn: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "800" },
  

  
  sectionLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 12 },
  
  sectorBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1 },
  
  rangeCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  rangeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  rangeTrack: { height: 6, borderRadius: 3, marginHorizontal: 8, position: 'relative' },
  rangeFill: { position: 'absolute', height: '100%', borderRadius: 3 },
  
  floatingAction: { position: 'absolute', bottom: 30, left: 0, right: 0, paddingHorizontal: 20, alignItems: 'center' },
  actionBtn: { width: '100%', maxWidth: 400, paddingVertical: 16, borderRadius: 16, alignItems: 'center', elevation: 8, shadowOffset: { height: 4, width: 0 }, shadowOpacity: 0.3, shadowRadius: 8 },
  actionBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 }
});
