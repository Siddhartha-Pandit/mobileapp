import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Target, ChevronLeft, PieChart, Sparkles } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { ColorPicker } from '../components/ColorPicker';
import HeaderBar from '../components/HeaderBar';

export default function AddCustomGoalScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [selectedColor, setSelectedColor] = useState(theme.brandPrimary);

  const colors = [
    theme.brandPrimary,
    '#1E293B',
    '#3B82F6',
    '#F97316',
    '#8B5CF6',
    '#EF4444',
    '#14B8A6',
  ];

  const handleSave = () => {
    if (!goalName || !targetAmount) return;
    console.log('Saving Goal:', { goalName, targetAmount, monthlyContribution, selectedColor });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Create New Goal"
        leftContent={
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.headerButton, { borderColor: theme.border, backgroundColor: theme.surface }]}
          >
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* 1. VISUAL ICON CARD */}
          <View style={styles.previewSection}>
            <View style={[
              styles.iconWrapper,
              {
                backgroundColor: `${selectedColor}10`,
                borderColor: `${selectedColor}40`,
              }
            ]}>
              <Target size={36} strokeWidth={2.5} color={selectedColor} />
            </View>
            <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>
              Goal Preview: <Text style={{ color: selectedColor, fontWeight: '700' }}>{goalName || 'Untitled Goal'}</Text>
            </Text>
          </View>

          {/* 2. BASIC INFO CARD */}
          <Card theme={theme} style={styles.card}>
            <CardHeader style={styles.cardHeader}>
              <CardTitle theme={theme}>Goal Details</CardTitle>
              <CardDescription theme={theme}>What are you saving up for?</CardDescription>
            </CardHeader>
            <CardContent theme={theme} style={styles.cardContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Goal Name</Text>
                <TextInput
                  value={goalName}
                  onChangeText={setGoalName}
                  placeholder="e.g., New Laptop"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { borderColor: theme.border, backgroundColor: `${theme.background}80`, color: theme.textPrimary }]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Target Amount</Text>
                <View style={styles.amountInputWrapper}>
                  <Text style={[styles.currencyPrefix, { color: theme.brandPrimary }]}>₨</Text>
                  <TextInput
                    value={targetAmount}
                    onChangeText={setTargetAmount}
                    keyboardType="numeric"
                    placeholder="0.00"
                    placeholderTextColor={theme.textSecondary}
                    style={[styles.input, styles.amountInput, { borderColor: theme.border, backgroundColor: `${theme.background}80`, color: theme.textPrimary }]}
                  />
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 3. PLANNING CARD */}
          <Card theme={theme} style={styles.card}>
            <CardHeader style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <PieChart size={18} color={theme.brandPrimary} />
                <CardTitle theme={theme}>Saving Plan</CardTitle>
              </View>
            </CardHeader>
            <CardContent theme={theme} style={styles.cardContent}>
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Monthly Commitment</Text>
                <TextInput
                  value={monthlyContribution}
                  onChangeText={setMonthlyContribution}
                  keyboardType="numeric"
                  placeholder="Amount per month (optional)"
                  placeholderTextColor={theme.textSecondary}
                  style={[styles.input, { borderColor: theme.border, backgroundColor: `${theme.background}80`, color: theme.textPrimary }]}
                />
              </View>

              <View style={styles.colorPickerSection}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>Goal Theme Color</Text>
                <View style={{ marginTop: 12 }}>
                  <ColorPicker
                    theme={theme}
                    colors={colors}
                    selected={selectedColor}
                    onChange={setSelectedColor}
                  />
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>

      {/* ACTION FOOTER */}
      <View style={[styles.footer, { borderTopColor: `${theme.border}40` }]}>
        <View style={styles.footerInner}>
          <PrimaryButton
            title="Create Goal"
            theme={theme}
            onPress={handleSave}
            disabled={!goalName || !targetAmount}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  container: {
    padding: 24,
    gap: 20,
  },
  previewSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconWrapper: {
    width: 84,
    height: 84,
    borderRadius: 28,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
  },
  cardHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
  },
  amountInputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  currencyPrefix: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    fontWeight: '800',
    fontSize: 16,
  },
  amountInput: {
    paddingLeft: 42,
  },
  colorPickerSection: {
    marginTop: 4,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    backgroundColor: 'transparent',
  },
  footerInner: {
    width: '100%',
  },
});
