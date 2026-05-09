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
import * as LucideIcons from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { StepProgress } from '@/components/StepProgress';
import { MultiSelectCategoryCard } from '@/components/MultiSelectCategoryCard';
import { setupService } from '../src/services/setupService';
import { useAuthStore } from '../src/store/useAuthStore';
import { useSetupStore } from '../src/store/useSetupStore';
import { PrimaryButton } from '@/components/PrimaryButton';
import { CheckCircle2, Tag } from 'lucide-react-native';

export default function ExpenseCategorySetupScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const { 
    selectedCategoryValues: selected, 
    toggleCategory, 
    setSelectedCategories, 
    customCategories 
  } = useSetupStore();

  const essentialValues = ['food', 'transport', 'housing', 'health', 'bills', 'insurance'];
  const isAllEssentialSelected = essentialValues.every(v => selected.includes(v));

  const toggleEssential = () => {
    if (isAllEssentialSelected) {
      setSelectedCategories(selected.filter(v => !essentialValues.includes(v)));
    } else {
      setSelectedCategories([...new Set([...selected, ...essentialValues])]);
    }
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
      const standardSelected = categories
        .filter(cat => selected.includes(cat.value))
        .map(cat => ({
          userId: user.id,
          name: cat.label,
          icon: cat.value,
          themeColor: '#4CAF50',
          isEssential: essentialValues.includes(cat.value)
        }));

      const customSelected = customCategories
        .filter(cat => selected.includes(cat.id))
        .map(cat => ({
          userId: user.id,
          name: cat.name,
          icon: cat.iconName,
          themeColor: cat.themeColor,
          isEssential: false
        }));

      await setupService.setupCategories([...standardSelected, ...customSelected]);
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

        {/* Essential Toggle Section */}
        <TouchableOpacity 
          onPress={toggleEssential}
          activeOpacity={0.7}
          style={[
            styles.essentialToggle, 
            { 
              backgroundColor: isAllEssentialSelected ? `${theme.brandPrimary}15` : theme.surface,
              borderColor: isAllEssentialSelected ? theme.brandPrimary : `${theme.border}40`
            }
          ]}
        >
          <View style={styles.essentialInfo}>
            <View style={[styles.iconContainer, { backgroundColor: isAllEssentialSelected ? theme.brandPrimary : `${theme.border}20` }]}>
              <CheckCircle2 size={20} color={isAllEssentialSelected ? '#fff' : theme.textSecondary} />
            </View>
            <View>
              <Text style={[styles.essentialTitle, { color: theme.textPrimary }]}>Essential Categories</Text>
              <Text style={[styles.essentialSubtitle, { color: theme.textSecondary }]}>Auto-select recommended basics</Text>
            </View>
          </View>
          <View style={[styles.checkbox, { borderColor: isAllEssentialSelected ? theme.brandPrimary : theme.border, backgroundColor: isAllEssentialSelected ? theme.brandPrimary : 'transparent' }]}>
            {isAllEssentialSelected && <CheckCircle2 size={14} color="#fff" />}
          </View>
        </TouchableOpacity>

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

            {/* Custom Categories */}
            {customCategories.map((cat) => {
              const IconComp = (LucideIcons as any)[cat.iconName] || Tag;
              return (
                <View key={cat.id} style={styles.gridItem}>
                  <MultiSelectCategoryCard
                    theme={theme}
                    label={cat.name}
                    value={cat.id}
                    icon={IconComp}
                    selectedValues={selected}
                    onToggle={toggleCategory}
                  />
                </View>
              );
            })}
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
  essentialToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 20,
    marginTop: 8,
  },
  essentialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  essentialTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  essentialSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
