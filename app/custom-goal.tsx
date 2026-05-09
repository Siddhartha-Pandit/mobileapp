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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as LucideIcons from 'lucide-react-native';
import { Pencil } from 'lucide-react-native';
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
import { IconModal } from '../components/IconModal';
import HeaderBar from '../components/HeaderBar';
import { useSetupStore } from '../src/store/useSetupStore';

export default function AddCustomGoalScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id: editId } = useLocalSearchParams<{ id?: string }>();
  const { budgets, addCustomBudget, updateBudget } = useSetupStore();

  // Find existing budget if in edit mode
  const existingBudget = editId ? budgets.find(b => b.id === editId) : null;

  const [goalName, setGoalName] = React.useState(existingBudget?.name || '');
  const [goalType, setGoalType] = React.useState<'percent' | 'amount'>(existingBudget?.type || 'amount');
  const [goalValue, setGoalValue] = React.useState(existingBudget ? String(existingBudget.value) : '');
  const [selectedColor, setSelectedColor] = React.useState(existingBudget?.color || theme.brandPrimary);
  const [selectedIcon, setSelectedIcon] = React.useState(existingBudget?.icon || 'Target');
  const [showIconModal, setShowIconModal] = React.useState(false);

  // Helper to handle both PascalCase and old lowercase icon names
  const getIconComponent = (name: string) => {
    if (!name) return LucideIcons.Target;
    // Try exact match first (PascalCase)
    if ((LucideIcons as any)[name]) return (LucideIcons as any)[name];
    // Fallback/Legacy handling
    const legacyMap: any = { home: 'Home', cart: 'ShoppingCart', 'trending-up': 'TrendingUp', target: 'Target' };
    const normalizedName = legacyMap[name.toLowerCase()] || name;
    return (LucideIcons as any)[normalizedName] || LucideIcons.Target;
  };

  const IconComp = getIconComponent(selectedIcon);

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
    if (!goalName || !goalValue) return;
    
    const budgetData = {
      name: goalName.trim(),
      type: goalType,
      value: Number(goalValue),
      color: selectedColor,
      icon: selectedIcon,
      smartReminder: true,
      description: goalType === 'percent' ? `${goalValue}% allocation` : `Rs ${goalValue} target`
    };

    if (existingBudget && editId) {
      updateBudget(editId, budgetData);
    } else {
      addCustomBudget(budgetData);
    }

    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title={existingBudget ? "Edit Goal" : "Create New Goal"}
        leftContent={
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.headerButton, { borderColor: theme.border, backgroundColor: theme.surface }]}
          >
            <LucideIcons.ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* 1. VISUAL ICON CARD */}
          <View style={styles.previewSection}>
            <TouchableOpacity 
              onPress={() => setShowIconModal(true)}
              style={[
                styles.iconWrapper,
                {
                  backgroundColor: `${selectedColor}10`,
                  borderColor: `${selectedColor}40`,
                }
              ]}
            >
              <IconComp size={36} strokeWidth={2.5} color={selectedColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowIconModal(true)} style={styles.changeIconButton}>
              <Pencil size={12} color={theme.brandPrimary} />
              <Text style={[styles.changeIconText, { color: theme.brandPrimary }]}>Change Icon & Color</Text>
            </TouchableOpacity>
            <Text style={[styles.previewLabel, { color: theme.textSecondary }]}>
              Goal Preview: <Text style={{ color: selectedColor, fontWeight: '700' }}>{goalName || 'Untitled Goal'}</Text>
            </Text>
          </View>

          {/* 2. BASIC INFO CARD */}
          <Card theme={theme} style={styles.card}>
            <CardHeader style={styles.cardHeader}>
              <CardTitle theme={theme}>Goal Details</CardTitle>
              <CardDescription theme={theme}>Set your target amount or allocation</CardDescription>
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
                <Text style={[styles.label, { color: theme.textSecondary }]}>Goal Type</Text>
                <View style={[styles.typeContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <TouchableOpacity 
                    onPress={() => setGoalType('amount')}
                    style={[styles.typeBtn, goalType === 'amount' && { backgroundColor: theme.brandPrimary }]}
                  >
                    <Text style={[styles.typeText, { color: goalType === 'amount' ? '#fff' : theme.textSecondary }]}>Fixed Amount</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setGoalType('percent')}
                    style={[styles.typeBtn, goalType === 'percent' && { backgroundColor: theme.brandPrimary }]}
                  >
                    <Text style={[styles.typeText, { color: goalType === 'percent' ? '#fff' : theme.textSecondary }]}>Percentage</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>{goalType === 'amount' ? 'Target Amount' : 'Percentage Allocation'}</Text>
                <View style={styles.amountInputWrapper}>
                  <Text style={[styles.currencyPrefix, { color: theme.brandPrimary }]}>{goalType === 'amount' ? '₨' : '%'}</Text>
                  <TextInput
                    value={goalValue}
                    onChangeText={setGoalValue}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={theme.textSecondary}
                    style={[styles.input, styles.amountInput, { borderColor: theme.border, backgroundColor: `${theme.background}80`, color: theme.textPrimary }]}
                  />
                </View>
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
            title={existingBudget ? "Update Goal" : "Create Goal"}
            theme={theme}
            onPress={handleSave}
            disabled={!goalName || !goalValue}
            fullWidth
          />
        </View>
      </View>
      {/* ICON PICKER MODAL */}
      {showIconModal && (
        <IconModal
          theme={theme}
          onClose={() => setShowIconModal(false)}
          selectedIcon={selectedIcon}
          activeColor={selectedColor}
          onColorSelect={setSelectedColor}
          onSelect={(icon) => {
            setSelectedIcon(icon.name);
            setShowIconModal(false);
          }}
        />
      )}
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
  typeContainer: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  typeBtn: {
    flex: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 13,
    fontWeight: '700',
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
  changeIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 169, 113, 0.05)',
  },
  changeIconText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
