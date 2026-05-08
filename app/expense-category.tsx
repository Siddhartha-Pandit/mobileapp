import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Pizza,
  Car,
  Home,
  HeartPulse,
  BookOpen,
  Film,
  ShoppingBag,
  Lightbulb,
  ShieldCheck,
  Scissors,
  Gift,
  Plane,
  Smartphone,
  Wrench,
  ChevronLeft,
} from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { StepProgress } from '@/components/StepProgress';
import { MultiSelectCategoryCard } from '@/components/MultiSelectCategoryCard';
import { setupService } from '../src/services/setupService';
import { useAuthStore } from '../src/store/useAuthStore';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function ExpenseCategorySetupScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [selected, setSelected] = useState<string[]>([
    'food',
    'transport',
    'housing',
    'health',
    'education',
    'bills',
  ]);

  const toggleCategory = (value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const categories = [
    { label: 'Food & Dining', value: 'food', icon: Pizza },
    { label: 'Transportation', value: 'transport', icon: Car },
    { label: 'Housing', value: 'housing', icon: Home },
    { label: 'Healthcare', value: 'health', icon: HeartPulse },
    { label: 'Education', value: 'education', icon: BookOpen },
    { label: 'Entertainment', value: 'entertainment', icon: Film },
    { label: 'Shopping', value: 'shopping', icon: ShoppingBag },
    { label: 'Bills & Utils', value: 'bills', icon: Lightbulb },
    { label: 'Insurance', value: 'insurance', icon: ShieldCheck },
    { label: 'Personal Care', value: 'personal', icon: Scissors },
    { label: 'Gifts', value: 'gifts', icon: Gift },
    { label: 'Travel', value: 'travel', icon: Plane },
    { label: 'Subscriptions', value: 'subs', icon: Smartphone },
    { label: 'Miscellaneous', value: 'misc', icon: Wrench },
  ];

  const { user } = useAuthStore();

  const handleContinue = async () => {
    if (user) {
      const selectedCategories = categories
        .filter(cat => selected.includes(cat.value))
        .map(cat => ({
          userId: user.id,
          name: cat.label,
          icon: cat.value, // Simplified icon name
          themeColor: '#4CAF50', // Default color for simplicity or add color map
          isEssential: true
        }));
      await setupService.setupCategories(selectedCategories);
    }
    router.push('/budget-setup');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <StepProgress
            theme={theme}
            step={3}
            totalSteps={4}
            title="Set Up Expense Categories"
            subtitle="Select categories that match your spending habits."
          />

        </View>

        {/* Scrollable Grid Section */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.grid}>
            {categories.map((cat) => (
              <View key={cat.value} style={styles.gridItem}>
                <MultiSelectCategoryCard
                  theme={theme}
                  label={cat.label}
                  value={cat.value}
                  icon={cat.icon}
                  selectedValues={selected}
                  onToggle={toggleCategory}
                />
              </View>
            ))}
          </View>

          {/* Add Custom Button */}
          <TouchableOpacity
            onPress={() => router.push('/custom-category')}
            style={[
              styles.customButton,
              { 
                borderColor: theme.brandPrimary,
                backgroundColor: `${theme.brandPrimary}10`
              }
            ]}
          >
            <Text style={[styles.customButtonText, { color: theme.brandPrimary }]}>
              + Add Custom Category
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Fixed Bottom Action Bar */}
        <View style={[styles.footer, { borderTopColor: `${theme.border}40` }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { borderColor: theme.border }]}
          >
            <Text style={[styles.backButtonText, { color: theme.textPrimary }]}>Back</Text>
          </TouchableOpacity>
          <View style={{ flex: 2 }}>
            <PrimaryButton
              title="Continue"
              theme={theme}
              onPress={handleContinue}
              fullWidth
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 16,
    flexShrink: 0,
  },
  tabsContainer: {
    marginTop: -8,
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 120, // Space for footer
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridItem: {
    width: '50%',
    padding: 6,
  },
  customButton: {
    marginTop: 16,
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    gap: 12,
    backgroundColor: 'transparent', // Allow background to show through if needed, but safeArea handles it
    borderTopWidth: 1,
  },
  backButton: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
