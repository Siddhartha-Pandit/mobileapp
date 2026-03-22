import React, { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import type { AppTheme } from '../constants/theme';

export interface Stock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  pe: string;
  pb: string;
  roe: string;
}

interface StockTableProps {
  theme: AppTheme;
  stocks?: Stock[];
}

const defaultStocks: Stock[] = [
    { symbol: 'NABIL', name: 'Nabil Bank Ltd.', price: '945.00', change: '+1.25%', pe: '18.4', pb: '3.2', roe: '16.5%' },
    { symbol: 'NMB', name: 'NMB Bank Limited', price: '312.00', change: '-0.42%', pe: '12.1', pb: '1.4', roe: '11.2%' },
    { symbol: 'EBL', name: 'Everest Bank', price: '610.00', change: '+0.88%', pe: '15.2', pb: '2.1', roe: '14.8%' },
    { symbol: 'HRL', name: 'Himalayan Re', price: '640.00', change: '+3.12%', pe: '42.1', pb: '5.6', roe: '12.4%' },
    { symbol: 'NICL', name: 'NIC Asia Insurance', price: '720.00', change: '-1.15%', pe: '22.4', pb: '4.1', roe: '10.9%' },
    { symbol: 'SCB', name: 'Standard Chartered', price: '520.00', change: '+0.15%', pe: '14.2', pb: '2.5', roe: '13.1%' },
    { symbol: 'GBIME', name: 'Global IME Bank', price: '215.00', change: '+0.45%', pe: '10.5', pb: '1.2', roe: '10.5%' },
    { symbol: 'HDL', name: 'Himalayan Distillery', price: '2,150.0', change: '-2.10%', pe: '35.2', pb: '8.4', roe: '24.1%' },
    { symbol: 'UPPER', name: 'Upper Tamakoshi', price: '198.00', change: '+0.00%', pe: 'N/A', pb: '2.1', roe: '-2.4%' },
    { symbol: 'SHIVM', name: 'Shivam Cements', price: '540.00', change: '+1.10%', pe: '45.2', pb: '3.1', roe: '8.2%' },
    { symbol: 'CIT', name: 'Citizen Invest Trust', price: '2,045.0', change: '+0.75%', pe: '28.1', pb: '4.2', roe: '15.2%' },
    { symbol: 'ADBL', name: 'Agri. Dev. Bank', price: '285.00', change: '-0.20%', pe: '13.4', pb: '1.5', roe: '9.8%' },
    { symbol: 'PCBL', name: 'Prime Comm. Bank', price: '210.00', change: '+0.95%', pe: '9.8', pb: '1.3', roe: '12.1%' },
    { symbol: 'NIFRA', name: 'Nepal Infra Bank', price: '202.00', change: '-0.50%', pe: '18.2', pb: '1.1', roe: '6.1%' },
    { symbol: 'NLIC', name: 'Nepal Life Ins.', price: '690.00', change: '+1.45%', pe: '32.4', pb: '4.8', roe: '11.5%' },
  ];

const columns = ['PRICE', 'CHANGE', 'P/E', 'P/B', 'ROE'];
const SYMBOL_CELL_WIDTH = 110;
const DATA_CELL_WIDTH = 90;

export const StockTable = ({ theme, stocks: propStocks }: StockTableProps) => {
  const stocks = propStocks || defaultStocks;
  const headerScrollRef = useRef<ScrollView>(null);
  const dataScrollRef = useRef<ScrollView>(null);

  const renderSymbolCell = ({ item }: { item: Stock }) => (
    <View style={[
      styles(theme).symbolCell,
      { 
        backgroundColor: theme.surface,
        borderRightColor: `${theme.border}20`,
        borderRightWidth: 1,
      }
    ]}>
      <Text style={styles(theme).symbolText}>{item.symbol}</Text>
      <Text style={styles(theme).symbolName}>
        {item.name.length > 14 ? `${item.name.slice(0, 14)}..` : item.name}
      </Text>
    </View>
  );

  const renderDataRow = ({ item }: { item: Stock }) => (
    <View style={styles(theme).dataRow}>
      <Text style={styles(theme).dataCell}>{item.price}</Text>
      <Text style={[styles(theme).dataCell, { color: item.change.includes('+') ? theme.brandPrimary : '#EF4444' }]}>
        {item.change}
      </Text>
      <Text style={styles(theme).dataCell}>{item.pe}</Text>
      <Text style={styles(theme).dataCell}>{item.pb}</Text>
      <Text style={styles(theme).dataCell}>{item.roe}</Text>
    </View>
  );

  return (
    <View style={{
      flex: 1,
      borderTopWidth: 1,
      borderTopColor: `${theme.border}40`,
      backgroundColor: theme.surface,
    }}>
      {/* -------- HEADER -------- */}
      <View style={{ flexDirection: 'row' }}>
        <View style={styles(theme).headerSymbolCell}>
          <Text style={styles(theme).headerText}>SYMBOL</Text>
        </View>
        <ScrollView
          ref={headerScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false} // Disable user scroll on header
          style={{ width: '100%' }}
        >
          <View style={{ flexDirection: 'row' }}>
            {columns.map((h) => (
              <Text key={h} style={styles(theme).headerDataCell}>{h}</Text>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* -------- BODY -------- */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* --- Fixed Symbol Column --- */}
        <FlatList
          data={stocks}
          keyExtractor={(item) => item.symbol}
          renderItem={renderSymbolCell}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false} // Scrolling is driven by the main data list
        />
        {/* --- Scrollable Data Area --- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={dataScrollRef}
          onScroll={(e) => {
            headerScrollRef.current?.scrollTo({ x: e.nativeEvent.contentOffset.x, animated: false });
          }}
          scrollEventThrottle={16}
        >
          <FlatList
            style={{ width: DATA_CELL_WIDTH * columns.length }}
            data={stocks}
            keyExtractor={(item) => item.symbol}
            renderItem={renderDataRow}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  headerSymbolCell: {
    width: SYMBOL_CELL_WIDTH,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: `${theme.border}40`,
    borderRightWidth: 1,
    borderRightColor: `${theme.border}20`,
    backgroundColor: theme.background,
  },
  headerText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.textSecondary,
  },
  headerDataCell: {
    width: DATA_CELL_WIDTH,
    height: 48,
    textAlign: 'right',
    paddingHorizontal: 16,
    lineHeight: 48, // Vertically center
    fontSize: 10,
    fontWeight: '800',
    color: theme.textSecondary,
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: `${theme.border}40`,
  },
  symbolCell: {
    width: SYMBOL_CELL_WIDTH,
    height: 64,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: `${theme.border}15`,
  },
  symbolText: {
    fontWeight: '800',
    color: theme.textPrimary,
    fontSize: 13,
    marginBottom: 2,
  },
  symbolName: {
    fontSize: 9,
    color: theme.textSecondary,
  },
  dataRow: {
    flexDirection: 'row',
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: `${theme.border}15`,
    backgroundColor: theme.surface,
  },
  dataCell: {
    width: DATA_CELL_WIDTH,
    textAlign: 'right',
    alignSelf: 'center',
    paddingHorizontal: 16,
    fontWeight: '700',
    color: theme.textPrimary,
    fontSize: 12,
  },
});
