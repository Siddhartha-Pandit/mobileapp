import { useRouter } from 'expo-router';
import {
  BookOpen,
  Car,
  Film,
  Gift,
  HeartPulse,
  Home,
  Lightbulb,
  Pizza,
  Plane,
  Plus,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Wrench,
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent } from '@/components/Card';
import HeaderBar from '@/components/HeaderBar';
import { useTheme } from '@/hooks/useTheme';

export default function ManageCategoriesScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const categories = [
    { label: 'Food & Dining', value: 'food', icon: Pizza, color: '#FF6B6B' },
    { label: 'Transportation', value: 'transport', icon: Car, color: '#4DABF7' },
    { label: 'Housing', value: 'housing', icon: Home, color: '#51CF66' },
    { label: 'Healthcare', value: 'health', icon: HeartPulse, color: '#FCC419' },
    { label: 'Education', value: 'education', icon: BookOpen, color: '#845EF7' },
    { label: 'Entertainment', value: 'entertainment', icon: Film, color: '#F06595' },
    { label: 'Shopping', value: 'shopping', icon: ShoppingBag, color: '#FF922B' },
    { label: 'Bills & Utils', value: 'bills', icon: Lightbulb, color: '#20C997' },
    { label: 'Insurance', value: 'insurance', icon: ShieldCheck, color: '#5C7CFA' },
    { label: 'Personal Care', value: 'personal', icon: Scissors, color: '#AE3EC9' },
    { label: 'Gifts', value: 'gifts', icon: Gift, color: '#748FFC' },
    { label: 'Travel', value: 'travel', icon: Plane, color: '#3BC9DB' },
    { label: 'Subscriptions', value: 'subs', icon: Smartphone, color: '#94D82D' },
    { label: 'Miscellaneous', value: 'misc', icon: Wrench, color: '#868E96' },
  ];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Categories"
        rightContent={
          <TouchableOpacity onPress={() => router.push('/manage-custom-category')} style={[{ width: 44, height: 44, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' }, { borderColor: `${theme.border}40`, backgroundColor: theme.surface }]}>
            <Plus size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Standard Categories</Text>
          <View style={styles.grid}>
            {categories.map((cat) => (
              <View key={cat.value} style={styles.gridItem}>
                <Card theme={theme} style={styles.categoryCard}>
                  <CardContent theme={theme} style={styles.cardContent}>
                    <View style={[styles.iconWrapper, { backgroundColor: `${cat.color}15` }]}>
                      <cat.icon size={26} color={cat.color} />
                    </View>
                    <Text style={[styles.categoryLabel, { color: theme.textPrimary }]} numberOfLines={1}>
                      {cat.label}
                    </Text>
                  </CardContent>
                </Card>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 120,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  container: { flex: 1 },
  sectionLabel: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 20, marginLeft: 6 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  gridItem: {
    width: '50%',
    padding: 8,
  },
  categoryCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'transparent',
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
    gap: 14,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
});
