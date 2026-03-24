import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Bell, Plus } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import HeaderBar from '@/components/HeaderBar';
import { Card, CardContent } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { BudgetSlider } from '@/components/BudgetSlider';
import { AmountInput } from '@/components/AmountInput';

export default function ManageGoalScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [income, setIncome] = useState('45000');
  const [needs, setNeeds] = useState(50);
  const [wants, setWants] = useState(30);
  const [savings, setSavings] = useState(20);
  const [reminder, setReminder] = useState(true);
  const incomeDate = new Date().toISOString().split('T')[0];

  const totalAllocated = needs + wants + savings;
  const calculateAmount = (percent: number) => Math.round((Number(income) * percent) / 100);

  const handleUpdate = () => {
    console.log('Goal Updated:', { income, needs, wants, savings, reminder });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Budget & Goals"
        leftContent={
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.headerButton, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}
          >
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* INCOME DETAIL */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Monthly Income</Text>
            <AmountInput
              theme={theme}
              value={income}
              onChangeText={setIncome}
              label="Estimated Monthly Earnings"
            />
            <View style={styles.dateInfo}>
              <Calendar size={14} color={theme.textSecondary} />
              <Text style={[styles.dateText, { color: theme.textSecondary }]}>Updating for {incomeDate}</Text>
            </View>
          </View>

          {/* ALLOCATION STRATEGY */}
          <View style={styles.section}>
            <View style={styles.strategyHeader}>
              <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Allocation Strategy</Text>
              <Text style={[styles.strategySubtitle, { color: theme.textSecondary }]}>50/30/20 Rule</Text>
            </View>
            
            <Card theme={theme} style={styles.strategyCard}>
              <CardContent theme={theme} style={styles.cardContent}>
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
                  style={[styles.customGoalButton, { borderColor: theme.border, backgroundColor: theme.surface }]}
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
          </View>

          {/* SMART REMINDERS */}
          <View style={styles.section}>
            <Card theme={theme}>
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
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          title="Update Budget Goals"
          theme={theme}
          onPress={handleUpdate}
          disabled={totalAllocated !== 100}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: 220 },
  container: { padding: 24, gap: 32 },
  section: { gap: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  dateInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dateText: { fontSize: 12, fontWeight: '600' },
  strategyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  strategySubtitle: { fontSize: 12, fontWeight: '700' },
  strategyCard: { borderRadius: 24 },
  cardContent: { padding: 20 },
  customGoalButton: { width: '100%', height: 50, marginTop: 12, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  customGoalButtonText: { fontWeight: '700', fontSize: 13 },
  totalContainer: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontWeight: '700', fontSize: 14 },
  percentageBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  percentageBadgeText: { fontSize: 13, fontWeight: '900' },
  reminderContent: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reminderLeft: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  reminderTitle: { fontWeight: '700', fontSize: 14 },
  reminderSubtitle: { fontSize: 12 },
  headerButton: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', bottom: 72, left: 0, right: 0, paddingHorizontal: 24, paddingVertical: 20, borderTopWidth: 1, width: '100%', maxWidth: 500, alignSelf: 'center' },
});
