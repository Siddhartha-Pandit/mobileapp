import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search, SlidersHorizontal, LayoutList, Plus, ChevronDown, X, Filter } from 'lucide-react-native';
import { Modal, TextInput, FlatList } from 'react-native';

import HeaderBar from '../../components/HeaderBar';
import { StockTable, type Stock } from '../../components/StockTable';
import { useTheme } from '../../hooks/useTheme';
import { CustomTabs } from '../../components/CustomTabs';

export default function DhukutiScreener() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'filters' | 'list'>('filters');
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['Commercial Banks']);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);

  // Dynamic active filters
  const [activeFilters, setActiveFilters] = useState<string[]>(['P/E Ratio', 'ROE %']);

  const [peRange, setPeRange] = useState({ min: 5, max: 25 });
  const [roeRange, setRoeRange] = useState({ min: 10, max: 30 });
  const [pbRange, setPbRange] = useState({ min: 1, max: 10 });
  const [divRange, setDivRange] = useState({ min: 0, max: 15 });

  const sectors = ['Commercial Banks', 'Hydropower', 'Finance', 'Insurance', 'Microfinance', 'Mutual Fund', 'Manufacturing', 'Others'];

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const stocks: Stock[] = [
    { symbol: 'NABIL', name: 'Nabil Bank Ltd.', price: '945.00', change: '+1.25%', pe: '18.4', pb: '3.2', roe: '16.5%' },
    { symbol: 'NMB', name: 'NMB Bank Limited', price: '312.00', change: '-0.42%', pe: '12.1', pb: '1.4', roe: '11.2%' },
    { symbol: 'EBL', name: 'Everest Bank', price: '610.00', change: '+0.88%', pe: '15.2', pb: '2.1', roe: '14.8%' },
    { symbol: 'HRL', name: 'Himalayan Re', price: '640.00', change: '+3.12%', pe: '42.1', pb: '5.6', roe: '12.4%' },
    { symbol: 'NICL', name: 'NIC Asia Insurance', price: '720.00', change: '-1.15%', pe: '22.4', pb: '4.1', roe: '10.9%' },
    { symbol: 'SCB', name: 'Standard Chartered', price: '520.00', change: '+0.15%', pe: '14.2', pb: '2.5', roe: '13.1%' },
  ];

  const getRangeState = (filter: string) => {
    switch(filter) {
      case 'P/E Ratio': return [peRange, setPeRange, 0, 100];
      case 'ROE %': return [roeRange, setRoeRange, 0, 50];
      case 'P/B Ratio': return [pbRange, setPbRange, 0, 20];
      case 'Dividend Yield': return [divRange, setDivRange, 0, 25];
      default: return [peRange, setPeRange, 0, 100];
    }
  };

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
          <TouchableOpacity 
            onPress={() => setIsFilterModalVisible(true)}
            style={styles.iconBtn}
          >
            <Plus size={22} color={theme.brandPrimary} />
          </TouchableOpacity>
        }
      />
      
      {/* TABS were here - moved inside ScrollView */}

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ paddingBottom: 160, maxWidth: 500, alignSelf: 'center', width: '100%' }}>
        <View style={{ marginTop: 12 }}>
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

        {activeTab === 'filters' ? (
          <View style={{ padding: 20 }}>
            {/* SECTOR MULTI-SELECT DROPDOWN */}
            <SectionLabel text="Sector" />
            <TouchableOpacity 
              onPress={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)}
              style={[
                styles.dropdownHeader, 
                { backgroundColor: theme.surface, borderColor: isSectorDropdownOpen ? theme.brandPrimary : theme.border }
              ]}
            >
              <Text style={{ color: selectedSectors.length > 0 ? theme.textPrimary : theme.textSecondary, flex: 1 }}>
                {selectedSectors.length > 0 ? selectedSectors.join(', ') : 'Select Sectors'}
              </Text>
              <ChevronDown size={20} color={theme.textSecondary} />
            </TouchableOpacity>

            {isSectorDropdownOpen && (
              <View style={[styles.dropdownContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                {sectors.map(sector => (
                  <TouchableOpacity 
                    key={sector}
                    onPress={() => {
                      if (selectedSectors.includes(sector)) {
                        setSelectedSectors(selectedSectors.filter(s => s !== sector));
                      } else {
                        setSelectedSectors([...selectedSectors, sector]);
                      }
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={{ color: selectedSectors.includes(sector) ? theme.brandPrimary : theme.textPrimary, fontWeight: selectedSectors.includes(sector) ? '700' : '400' }}>
                      {sector}
                    </Text>
                    {selectedSectors.includes(sector) && <Plus size={16} color={theme.brandPrimary} style={{ transform: [{ rotate: '45deg' }] }} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <SectionLabel text="Valuation" />
            
            {/* DYNAMIC RANGE FILTERS */}
            {activeFilters.map(filterName => {
              const [val, setVal, minLimit, maxLimit] = getRangeState(filterName);
              return (
                <RangeCard 
                  key={filterName}
                  theme={theme}
                  title={filterName}
                  value={val}
                  onChange={setVal}
                  minLimit={minLimit}
                  maxLimit={maxLimit}
                  onRemove={() => removeFilter(filterName)}
                />
              );
            })}
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
             <StockTable theme={theme} stocks={stocks} />
          </View>
        )}
      </ScrollView>

      {/* FLOATING ACTION REMOVED */}
      
      {/* FILTER SELECTION MODAL */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsFilterModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Add Filter</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <X size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              {[
                { label: 'Valuation', items: ['P/E Ratio', 'P/B Ratio', 'ROE %', 'Dividend Yield'] },
                { label: 'Technical', items: ['RSI (14)', 'MACD', '52W High/Low', 'Volume Avg'] },
                { label: 'Financials', items: ['Net Profit', 'EPS', 'Reserve', 'Paid up Capital'] }
              ].map((section) => (
                <View key={section.label} style={styles.modalSection}>
                  <Text style={[styles.modalSectionLabel, { color: theme.textSecondary }]}>{section.label}</Text>
                  <View style={styles.modalGrid}>
                    {section.items.map(item => (
                      <TouchableOpacity 
                        key={item} 
                        onPress={() => addFilter(item)}
                        style={[
                          styles.modalGridItem, 
                          { 
                            backgroundColor: activeFilters.includes(item) ? `${theme.brandPrimary}15` : theme.background, 
                            borderColor: activeFilters.includes(item) ? theme.brandPrimary : theme.border 
                          }
                        ]}
                      >
                        <Text style={{ 
                          color: activeFilters.includes(item) ? theme.brandPrimary : theme.textPrimary, 
                          fontSize: 13,
                          fontWeight: activeFilters.includes(item) ? '700' : '400'
                        }}>
                          {item}
                        </Text>
                        <Plus size={14} color={activeFilters.includes(item) ? theme.brandPrimary : theme.textSecondary} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const RangeCard = ({ theme, title, value, onChange, minLimit, maxLimit, onRemove }: any) => {
  const [trackWidth, setTrackWidth] = useState(0);

  const handleTouch = (evt: any) => {
    if (trackWidth === 0) return;
    const x = evt.nativeEvent.locationX;
    const percent = Math.max(0, Math.min(1, x / trackWidth));
    const newVal = Math.round(minLimit + percent * (maxLimit - minLimit));
    
    // Simple logic: update whichever handle is closer, or here just set fixed range for demo
    // For a true range slider we'd need more complex logic. 
    // Let's just make it update the 'max' for simplicity in this touch-based demo, 
    // or provide two handles if we want to be fully functional.
    onChange({ ...value, max: newVal });
  };

  return (
    <View style={[styles.rangeCard, { backgroundColor: theme.surface, borderColor: `${theme.border}80` }]}>
      <View style={styles.rangeHeader}>
        <View style={styles.rangeInfo}>
          <Filter size={14} color={theme.brandPrimary} style={{ marginRight: 6 }} />
          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>{title}</Text>
        </View>
        <TouchableOpacity onPress={onRemove} style={styles.removeRangeBtn}>
          <X size={14} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputGrid}>
        <View style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>MIN</Text>
          <TextInput
            style={[styles.textInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.background }]}
            value={String(value.min)}
            onChangeText={(val) => onChange({ ...value, min: Number(val) || 0 })}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputDivider} />
        <View style={styles.inputWrapper}>
          <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>MAX</Text>
          <TextInput
            style={[styles.textInput, { color: theme.textPrimary, borderColor: theme.border, backgroundColor: theme.background }]}
            value={String(value.max)}
            onChangeText={(val) => onChange({ ...value, max: Number(val) || 0 })}
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity 
        activeOpacity={1}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        onPress={handleTouch}
        style={[styles.rangeTrack, { backgroundColor: theme.border, marginTop: 24 }]}
      >
        <View 
          style={[
            styles.rangeFill, 
            { 
              backgroundColor: theme.brandPrimary, 
              left: `${((value.min - minLimit) / (maxLimit - minLimit)) * 100}%`, 
              right: `${100 - ((value.max - minLimit) / (maxLimit - minLimit)) * 100}%` 
            }
          ]} 
        />
        {/* Knobs */}
        <View style={[styles.knob, { backgroundColor: theme.surface, borderColor: theme.brandPrimary, left: `${((value.min - minLimit) / (maxLimit - minLimit)) * 100}%`, marginLeft: -10 }]} />
        <View style={[styles.knob, { backgroundColor: theme.surface, borderColor: theme.brandPrimary, left: `${((value.max - minLimit) / (maxLimit - minLimit)) * 100}%`, marginLeft: -10 }]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  iconBtn: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "800" },
  

  
  sectionLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginTop: 24, marginBottom: 12 },
  
  filterHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  plusBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },

  dropdownHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  dropdownContent: { borderRadius: 14, borderWidth: 1, padding: 8, marginBottom: 16, gap: 4 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: 8 },

  rangeCard: { padding: 18, borderRadius: 20, borderWidth: 1, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  rangeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  rangeInfo: { flexDirection: 'row', alignItems: 'center' },
  removeRangeBtn: { padding: 4 },
  
  inputGrid: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  inputWrapper: { flex: 1 },
  inputLabel: { fontSize: 9, fontWeight: '800', marginBottom: 6 },
  textInput: { height: 44, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, fontSize: 14, fontWeight: '700' },
  inputDivider: { width: 12, height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginTop: 18 },

  rangeTrack: { height: 6, borderRadius: 3, position: 'relative' },
  rangeFill: { position: 'absolute', height: '100%', borderRadius: 3 },
  knob: { position: 'absolute', width: 20, height: 20, borderRadius: 10, borderWidth: 2, top: -7, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, maxHeight: '85%' },
  modalHandle: { width: 40, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalScroll: { paddingBottom: 20 },
  modalSection: { marginBottom: 24 },
  modalSectionLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  modalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  modalGridItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1 },
  applyBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 12 },
  applyBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },

  floatingAction: { position: 'absolute', bottom: 30, left: 0, right: 0, paddingHorizontal: 20, alignItems: 'center' },
  actionBtn: { width: '100%', maxWidth: 400, paddingVertical: 16, borderRadius: 16, alignItems: 'center', elevation: 8, shadowOffset: { height: 4, width: 0 }, shadowOpacity: 0.3, shadowRadius: 8 },
  actionBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 }
});
