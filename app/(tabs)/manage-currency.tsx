import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import HeaderBar from '@/components/HeaderBar';
import { Card, CardContent } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function ManageCurrencyScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [currency, setCurrency] = useState('NPR');

  const currencies = [
    { label: 'NPR', description: 'Nepalese Rupee', value: 'NPR', symbol: 'Rs' },
    { label: 'USD', description: 'United States Dollar', value: 'USD', symbol: '$' },
    { label: 'INR', description: 'Indian Rupee', value: 'INR', symbol: '₹' },
    { label: 'EUR', description: 'Euro', value: 'EUR', symbol: '€' },
    { label: 'GBP', description: 'British Pound', value: 'GBP', symbol: '£' },
    { label: 'AUD', description: 'Australian Dollar', value: 'AUD', symbol: 'A$' },
  ];

  const handleSave = () => {
    Alert.alert(
      "Confirm Currency Change",
      "Changing the currency will convert the amount to today's conversion rate.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "OK", 
          onPress: () => {
            console.log('Currency saved:', currency);
            router.back();
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Currency Settings"
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introBox}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>SELECT DEFAULT CURRENCY</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            This currency will be used for all your accounts and transactions by default.
          </Text>
        </View>

        <View style={styles.optionsGrid}>
          {currencies.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => setCurrency(item.value)}
              activeOpacity={0.7}
              style={styles.optionWrapper}
            >
              <Card 
                theme={theme} 
                style={[
                  styles.currencyCard, 
                  { borderColor: currency === item.value ? theme.brandPrimary : 'transparent' },
                  currency === item.value && { backgroundColor: `${theme.brandPrimary}08` }
                ]}
              >
                <CardContent theme={theme} style={styles.cardContent}>
                  <View style={styles.cardLeft}>
                    <View style={[styles.symbolBox, { backgroundColor: currency === item.value ? theme.brandPrimary : theme.surface }]}>
                      <Text style={[styles.symbolText, { color: currency === item.value ? '#FFF' : theme.textPrimary }]}>
                        {item.symbol}
                      </Text>
                    </View>
                    <View>
                      <Text style={[styles.currencyLabel, { color: theme.textPrimary }]}>{item.label}</Text>
                      <Text style={[styles.currencyDesc, { color: theme.textSecondary }]}>{item.description}</Text>
                    </View>
                  </View>
                  {currency === item.value && (
                    <View style={[styles.checkCircle, { backgroundColor: theme.brandPrimary }]}>
                      <Check size={12} color="#FFF" />
                    </View>
                  )}
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          title="Save Currency Settings"
          theme={theme}
          onPress={handleSave}
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
  introBox: { marginBottom: 32 },
  sectionLabel: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 },
  sectionSubtitle: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  optionsGrid: { gap: 14 },
  optionWrapper: { width: '100%' },
  currencyCard: { borderRadius: 24, borderWidth: 1.5 },
  cardContent: { padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  symbolBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  symbolText: { fontSize: 18, fontWeight: '900' },
  currencyLabel: { fontSize: 16, fontWeight: '800' },
  currencyDesc: { fontSize: 12, fontWeight: '600' },
  checkCircle: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
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
