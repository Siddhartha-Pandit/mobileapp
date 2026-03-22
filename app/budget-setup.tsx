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
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Plus, ChevronLeft, Calendar } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import HeaderBar from '../components/HeaderBar';
import { Card, CardContent } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { BudgetSlider } from '../components/BudgetSlider';
import { StepProgress } from '../components/StepProgress';

export default function BudgetSetupFinalScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [income, setIncome] = useState(45000);
  const [needs, setNeeds] = useState(50);
  const [wants, setWants] = useState(30);
  const [savings, setSavings] = useState(20);
  const [reminder, setReminder] = useState(true);
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split('T')[0]);

  const totalAllocated = needs + wants + savings;
  const calculateAmount = (percent: number) => Math.round((income * percent) / 100);

  const handleComplete = () => {
    console.log('Budget Setup Complete:', { income, needs, wants, savings, reminder });
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        leftContent={
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.headerButton, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}
          >
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        title="Budget Setup"
        rightContent={<View style={{ width: 32 }} />}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.progressContainer}>
            <StepProgress
              theme={theme}
              step={4}
              totalSteps={4}
              title="Set Your Budget Goals"
              subtitle="Allocate your monthly income wisely"
            />
          </View>

          {/* 1. INCOME DETAIL CARD */}
          <Card theme={theme} style={styles.card}>
            <CardContent theme={theme} style={styles.cardContent}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Income Detail</Text>
                <View style={styles.dateDisplay}>
                  <Calendar size={14} color={theme.brandPrimary} />
                  <Text style={[styles.dateText, { color: theme.brandPrimary }]}>{incomeDate}</Text>
                </View>
              </View>

              <View style={styles.incomeInputContainer}>
                <Text style={[styles.currencyPrefix, { color: theme.brandPrimary }]}>NPR</Text>
                <TextInput
                  value={String(income)}
                  onChangeText={(val) => setIncome(Number(val))}
                  keyboardType="numeric"
                  style={[styles.incomeInput, { color: theme.textPrimary }]}
                />
              </View>
            </CardContent>
          </Card>

          {/* 2. ALLOCATION STRATEGY CARD */}
          <Card theme={theme} style={styles.card}>
            <CardContent theme={theme} style={styles.cardContent}>
              <View style={styles.strategyHeader}>
                <Text style={[styles.strategyTitle, { color: theme.textPrimary }]}>Allocation Strategy</Text>
                <Text style={[styles.strategySubtitle, { color: theme.textSecondary }]}>Using the 50/30/20 guideline</Text>
              </View>

              <BudgetSlider
                theme={theme}
                label="Needs"
                description="Rent, food, and utilities"
                percentage={needs}
                amount={calculateAmount(needs)}
                color={theme.brandPrimary}
                onChange={setNeeds}
              />
              <BudgetSlider
                theme={theme}
                label="Wants"
                description="Entertainment and hobbies"
                percentage={wants}
                amount={calculateAmount(wants)}
                color="#3B82F6"
                onChange={setWants}
              />
              <BudgetSlider
                theme={theme}
                label="Savings"
                description="Emergency and investments"
                percentage={savings}
                amount={calculateAmount(savings)}
                color="#10B981"
                onChange={setSavings}
              />

              <TouchableOpacity
                onPress={() => router.push('/custom-goal')}
                style={[styles.customGoalButton, { borderColor: theme.border }]}
              >
                <Plus size={18} color={theme.textSecondary} />
                <Text style={[styles.customGoalButtonText, { color: theme.textSecondary }]}>Add Custom Goal</Text>
              </TouchableOpacity>

              <View style={[styles.totalContainer, { borderTopColor: `${theme.border}40` }]}>
                <Text style={[styles.totalLabel, { color: totalAllocated === 100 ? theme.textPrimary : '#EF4444' }]}>Total Allocated</Text>
                <View style={[styles.percentageBadge, { backgroundColor: totalAllocated === 100 ? `${theme.brandPrimary}15` : '#EF444415' }]}>
                  <Text style={[styles.percentageBadgeText, { color: totalAllocated === 100 ? theme.brandPrimary : '#EF4444' }]}>
                    {totalAllocated}%
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 3. SMART REMINDERS CARD */}
          <Card theme={theme} style={styles.card}>
            <CardContent theme={theme} style={styles.reminderContent}>
              <View style={styles.reminderLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${theme.brandPrimary}10` }]}>
                  <Bell size={20} color={theme.brandPrimary} />
                </View>
                <View>
                  <Text style={[styles.reminderTitle, { color: theme.textPrimary }]}>Smart Reminders</Text>
                  <Text style={[styles.reminderSubtitle, { color: theme.textSecondary }]}>Alert me when limits are near</Text>
                </View>
              </View>

              <Switch
                value={reminder}
                onValueChange={setReminder}
                trackColor={{ false: theme.border, true: theme.brandPrimary }}
                thumbColor="#FFF"
              />
            </CardContent>
          </Card>
        </View>
      </ScrollView>

      {/* FIXED FOOTER */}
      <View style={[styles.footer, { borderTopColor: `${theme.border}40` }]}>
        <View style={styles.footerInner}>
          <PrimaryButton
            title="Complete Setup"
            theme={theme}
            fullWidth
            onPress={handleComplete}
            disabled={totalAllocated !== 100}
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
    paddingBottom: 140,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  container: {
    padding: 24,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  progressContainer: {
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
  },
  incomeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: '800',
  },
  incomeInput: {
    fontSize: 32,
    fontWeight: '900',
    flex: 1,
    padding: 0,
  },
  strategyHeader: {
    marginBottom: 20,
  },
  strategyTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  strategySubtitle: {
    fontSize: 13,
  },
  customGoalButton: {
    width: '100%',
    height: 50,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  customGoalButtonText: {
    fontWeight: '700',
    fontSize: 13,
  },
  totalContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontWeight: '700',
    fontSize: 14,
  },
  percentageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  percentageBadgeText: {
    fontSize: 13,
    fontWeight: '900',
  },
  reminderContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderLeft: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTitle: {
    fontWeight: '700',
    fontSize: 14,
  },
  reminderSubtitle: {
    fontSize: 12,
  },
  headerButton: {
    width: 32,
    height: 32,
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
  },
  footerInner: {
    width: '100%',
    maxWidth: 550,
    alignSelf: 'center',
  },
});
