import * as React from 'react';
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
import { StepProgress } from '../components/StepProgress';
import { setupService } from '../src/services/setupService';
import { useAuthStore } from '../src/store/useAuthStore';
import { useSetupStore, SetupBudget } from '../src/store/useSetupStore';
import { PrimaryButton } from '../components/PrimaryButton';
import * as LucideIcons from 'lucide-react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { Animated } from 'react-native';
import { AppTheme } from '../constants/theme';

interface BudgetItemRowProps {
  theme: AppTheme;
  budget: SetupBudget;
  currencySymbol: string;
  onUpdate: (updates: Partial<SetupBudget>) => void;
  onEdit: () => void;
  onRemove: () => void;
}

function BudgetItemRow({ theme, budget, currencySymbol, onUpdate, onEdit, onRemove }: BudgetItemRowProps) {
  // Helper to handle both PascalCase and old lowercase icon names
  const getIconComponent = (name: string) => {
    if (!name) return LucideIcons.Tag;
    if ((LucideIcons as any)[name]) return (LucideIcons as any)[name];
    const legacyMap: any = { home: 'Home', cart: 'ShoppingCart', 'trending-up': 'TrendingUp', target: 'Target' };
    const normalizedName = legacyMap[name.toLowerCase()] || name;
    return (LucideIcons as any)[normalizedName] || LucideIcons.Tag;
  };

  const IconComp = getIconComponent(budget.icon);

  const renderRightActions = (progress: any, dragX: any) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <RectButton style={styles.deleteAction} onPress={onRemove}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Trash2 size={24} color="#FFF" />
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
    >
      <Card theme={theme} style={styles.budgetCard}>
        <CardContent theme={theme} style={styles.budgetCardContent}>
          {/* HEADER: Icon, Title, and Toggle */}
          <View style={styles.budgetHeader}>
            <View style={styles.budgetHeaderLeft}>
              <TouchableOpacity 
                onPress={onEdit}
                style={[styles.iconContainer, { backgroundColor: `${budget.color}15` }]}
              >
                <IconComp size={18} color={budget.color} />
                <View style={[styles.editIconBadge, { backgroundColor: theme.surface }]}>
                  <Pencil size={8} color={theme.textSecondary} />
                </View>
              </TouchableOpacity>
              <Text style={[styles.budgetName, { color: theme.textPrimary }]}>{budget.name}</Text>
            </View>
            
            <View style={styles.budgetHeaderRight}>
              <View style={[styles.designToggle, { backgroundColor: theme.background }]}>
                <TouchableOpacity 
                  onPress={() => onUpdate({ type: 'amount' })}
                  style={[styles.designToggleBtn, budget.type === 'amount' && { backgroundColor: theme.surface, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }]}
                >
                  <Text style={[styles.designToggleText, { color: budget.type === 'amount' ? theme.brandPrimary : theme.textSecondary }]}>{currencySymbol}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => onUpdate({ type: 'percent' })}
                  style={[styles.designToggleBtn, budget.type === 'percent' && { backgroundColor: theme.surface, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }]}
                >
                  <Text style={[styles.designToggleText, { color: budget.type === 'percent' ? theme.brandPrimary : theme.textSecondary }]}>%</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* INPUT AREA WITH FLOATING LABEL */}
          <View style={[styles.inputWrapper, { borderColor: theme.border }]}>
            <View style={[styles.inputLabelContainer, { backgroundColor: theme.surface }]}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Limit {budget.type === 'percent' ? '(%)' : ''}
              </Text>
            </View>
            <View style={styles.inputInner}>
              <TextInput
                value={String(budget.value)}
                onChangeText={(val) => onUpdate({ value: Number(val) || 0 })}
                keyboardType="numeric"
                style={[styles.budgetInput, { color: theme.textPrimary }]}
                placeholder="Set amount"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>
        </CardContent>
      </Card>
    </Swipeable>
  );
}

export default function BudgetSetupFinalScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const { user } = useAuthStore();
  const { budgets, updateBudget, removeBudget, currencySymbol, hydrateStore } = useSetupStore();
  const [reminder, setReminder] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      hydrateStore(user.id);
    }
  }, [user, hydrateStore]);

  const totalPercentage = budgets
    .filter(b => b.type === 'percent')
    .reduce((acc, curr) => acc + curr.value, 0);

  const handleComplete = async () => {
    if (user) {
      const budgetData = budgets.map(b => ({
        userId: user.id,
        name: b.name,
        goalAmount: b.type === 'amount' ? b.value : null,
        percentageAllocation: b.type === 'percent' ? b.value : null,
        color: b.color,
        icon: b.icon,
        smartReminder: reminder,
      }));
      await setupService.setupBudgets(budgetData);
    }
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

          {/* BUDGET ALLOCATION CARD */}
          <Card theme={theme} style={styles.card}>
            <CardContent theme={theme} style={styles.cardContent}>
              <View style={styles.strategyHeader}>
                <Text style={[styles.strategyTitle, { color: theme.textPrimary }]}>Allocation Strategy</Text>
                <Text style={[styles.strategySubtitle, { color: theme.textSecondary }]}>Set by fixed amount or percentage</Text>
              </View>

              {budgets.map((budget) => (
                <BudgetItemRow
                  key={budget.id}
                  theme={theme}
                  budget={budget}
                  currencySymbol={currencySymbol}
                  onUpdate={(updates) => updateBudget(budget.id, updates)}
                  onEdit={() => router.push({ pathname: '/custom-goal', params: { id: budget.id } })}
                  onRemove={() => removeBudget(budget.id)}
                />
              ))}

              <TouchableOpacity
                onPress={() => router.push('/custom-goal')}
                style={[styles.customGoalButton, { borderColor: theme.border }]}
              >
                <Plus size={18} color={theme.textSecondary} />
                <Text style={[styles.customGoalButtonText, { color: theme.textSecondary }]}>Add Custom Goal</Text>
              </TouchableOpacity>

              <View style={[styles.totalContainer, { borderTopColor: `${theme.border}40` }]}>
                <Text style={[styles.totalLabel, { color: totalPercentage <= 100 ? theme.textPrimary : '#EF4444' }]}>Total Percentage</Text>
                <View style={[styles.percentageBadge, { backgroundColor: totalPercentage <= 100 ? `${theme.brandPrimary}15` : '#EF444415' }]}>
                  <Text style={[styles.totalBadgeText, { color: totalPercentage <= 100 ? theme.brandPrimary : '#EF4444' }]}>
                    {totalPercentage}%
                  </Text>
                </View>
              </View>
              {totalPercentage > 100 && (
                <Text style={styles.errorText}>Percentage allocation cannot exceed 100%</Text>
              )}
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
            disabled={totalPercentage > 100}
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
  budgetCard: {
    marginBottom: 10,
    borderRadius: 24,
    borderWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      }
    }),
  },
  budgetCardContent: {
    padding: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetName: {
    fontSize: 15,
    fontWeight: '800',
  },
  budgetHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  designToggle: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12,
    gap: 2,
  },
  designToggleBtn: {
    width: 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  designToggleText: {
    fontSize: 13,
    fontWeight: '800',
  },
  deleteBtn: {
    padding: 8,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 8,
    position: 'relative',
  },
  inputLabelContainer: {
    position: 'absolute',
    top: -10,
    left: 14,
    paddingHorizontal: 6,
    zIndex: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetInput: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    padding: 0,
  },
  calculatedValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionMenu: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 140,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }
    }),
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
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
  totalBadgeText: {
    fontSize: 13,
    fontWeight: '900',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
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
  editIconBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    elevation: 2,
  },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 16,
    marginBottom: 10,
    // Add a slight margin left so it doesn't overlap the card shadow
    marginLeft: -10,
  },
});
