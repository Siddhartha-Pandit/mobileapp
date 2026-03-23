import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Users,
  Target,
  Wallet,
  LayoutGrid,
  User,
  Plus,
  FileText,
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { SectionHeader } from "../../components/SectionHeader";
import HeaderBar from "../../components/HeaderBar";
import { Card, CardContent } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { AmountInput } from "../../components/AmountInput";
import { FormInput } from "../../components/FormInput";
import { FormSelect } from "../../components/FormSelect";
import { FormDatePicker } from "../../components/FormDatePicker";
import type { AppTheme } from "../../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Goal {
  id: string;
  name: string;
  percentage: number;
  allocatedAmount: number;
}

interface Person {
  id: string;
  name: string;
  avatar?: string;
  amountContributed: number;
}

export default function AddMoneyScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // --- STATE ---
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [description, setDescription] = useState("");
  const [account, setAccount] = useState("Standard Chartered Bank");
  const [category, setCategory] = useState("Salary");
  const [incomeDate, setIncomeDate] = useState(new Date());

  const [availablePeople, setAvailablePeople] = useState<Person[]>([
    { id: "1", name: "Ankit", amountContributed: 0 },
    { id: "2", name: "Suman", amountContributed: 0 },
    { id: "3", name: "Rahul", amountContributed: 0 },
    { id: "4", name: "Priya", amountContributed: 0 },
  ]);
  const [selectedPeopleIds, setSelectedPeopleIds] = useState<string[]>([]);
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", name: "Emergency Fund", percentage: 0.5, allocatedAmount: 0 },
    { id: "2", name: "New Laptop", percentage: 0.3, allocatedAmount: 0 },
    { id: "3", name: "Travel", percentage: 0.2, allocatedAmount: 0 },
  ]);

  // --- CALCULATION LOGIC ---
  useEffect(() => {
    const total = Math.floor(parseFloat(totalAmount) || 0);

    let remainingGoalAmount = total;
    setGoals((prev) =>
      prev.map((g, index) => {
        let amount;
        if (index === prev.length - 1) {
          amount = remainingGoalAmount;
        } else {
          amount = Math.floor(total * g.percentage);
          remainingGoalAmount -= amount;
        }
        return { ...g, allocatedAmount: amount };
      })
    );

    if (selectedPeopleIds.length > 0) {
      const baseShare = Math.floor(total / selectedPeopleIds.length);
      let extraRemainder = total % selectedPeopleIds.length;

      setAvailablePeople((prev) =>
        prev.map((p) => {
          if (!selectedPeopleIds.includes(p.id))
            return { ...p, amountContributed: 0 };
          const bonus = extraRemainder > 0 ? 1 : 0;
          if (bonus > 0) extraRemainder--;
          return { ...p, amountContributed: baseShare + bonus };
        })
      );
    }
  }, [totalAmount, selectedPeopleIds]);

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Add Money"
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ================= AMOUNT INPUT ================= */}
        <AmountInput
          theme={theme}
          label="Total Amount"
          value={totalAmount}
          onChangeText={setTotalAmount}
          autoFocus
        />

        {/* ================= CORE DETAILS ================= */}
        <View style={styles.detailsGroup}>
          <FormSelect
            label="Deposit To"
            value={account}
            onSelect={setAccount}
            options={["Standard Chartered Bank", "HDFC Savings", "Cash Wallet"]}
            theme={theme}
            icon={<Wallet />}
          />

          <FormSelect
            label="Category"
            value={category}
            onSelect={setCategory}
            options={["Salary", "Freelance", "Gift", "Investment", "Other"]}
            theme={theme}
            icon={<LayoutGrid />}
          />

          <FormDatePicker
            label="Income Date"
            value={incomeDate}
            onChange={setIncomeDate}
            theme={theme}
          />

          <FormInput
            label="Description / Source"
            value={description}
            onChangeText={setDescription}
            theme={theme}
            placeholder="e.g. Monthly Salary"
            icon={<FileText />}
          />
        </View>

        {/* ================= CONTRIBUTORS ================= */}
        <SectionHeader
          theme={theme}
          variant="label"
          title="Who gave this money?"
          icon={<Users size={16} color={theme.textSecondary} />}
          marginBottom={8}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.peopleScroll}>
          {availablePeople.map((p) => (
            <AvatarItem
              key={p.id}
              person={p}
              isSelected={selectedPeopleIds.includes(p.id)}
              onClick={() => setSelectedPeopleIds(prev => 
                prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
              )}
              theme={theme}
            />
          ))}
          <TouchableOpacity onPress={() => router.push('/add-person')} style={styles.addPersonWrap}>
            <View style={[styles.addPersonCircle, { borderColor: theme.border }]}>
              <Plus size={24} color={theme.textSecondary} />
            </View>
            <Text style={[styles.addPersonText, { color: theme.textSecondary }]}>Add</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ================= DYNAMIC SPLITS ================= */}
        {selectedPeopleIds.length > 0 && (
          <View style={[styles.splitsCard, { backgroundColor: theme.surface, borderColor: `${theme.border}40` }]}>
            {availablePeople
              .filter((p) => selectedPeopleIds.includes(p.id))
              .map((p) => (
                <View key={p.id} style={[styles.splitRow, { borderBottomColor: `${theme.border}20` }]}>
                  <Text style={[styles.splitName, { color: theme.textPrimary }]}>{p.name}</Text>
                  <InputWrapper
                    value={p.amountContributed}
                    theme={theme}
                    onChange={(v) => {
                      setAvailablePeople((prev) =>
                        prev.map((pers) =>
                          pers.id === p.id
                            ? { ...pers, amountContributed: parseFloat(v) || 0 }
                            : pers
                        )
                      );
                    }}
                  />
                </View>
              ))}
          </View>
        )}

        {/* ================= GOALS ================= */}
        <SectionHeader
          theme={theme}
          variant="label"
          title="Goal Allocation"
          icon={<Target size={16} color={theme.textSecondary} />}
          marginBottom={8}
        />
        <Card theme={theme} style={styles.goalsCard}>
          <CardContent theme={theme} style={styles.goalsContent}>
            {goals.map((g, idx) => (
              <View
                key={g.id}
                style={[
                  styles.goalRow,
                  idx !== goals.length - 1 && { borderBottomWidth: 1, borderBottomColor: `${theme.border}30` },
                ]}
              >
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalName, { color: theme.textPrimary }]}>{g.name}</Text>
                  <Text style={[styles.goalLabel, { color: theme.textSecondary }]}>TARGET ALLOCATION</Text>
                </View>
                <InputWrapper
                  value={g.allocatedAmount}
                  theme={theme}
                  onChange={(v) => {
                    setGoals((prev) =>
                      prev.map((goal) =>
                        goal.id === g.id
                          ? { ...goal, allocatedAmount: parseFloat(v) || 0 }
                          : goal
                      )
                    );
                  }}
                />
              </View>
            ))}
          </CardContent>
        </Card>
      </ScrollView>

      {/* ================= FOOTER BUTTON ================= */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          theme={theme}
          title="Confirm Deposit"
          onPress={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}

const AvatarItem = ({ person, isSelected, onClick, theme }: any) => (
  <TouchableOpacity onPress={onClick} style={styles.avatarWrap}>
    <View
      style={[
        styles.avatarCircle,
        {
          backgroundColor: isSelected ? theme.brandPrimary : theme.surface,
          borderColor: isSelected ? 'transparent' : `${theme.border}80`,
          borderWidth: isSelected ? 0 : 1.5,
        },
      ]}
    >
      <User size={28} color={isSelected ? "#fff" : theme.textSecondary} />
    </View>
    <Text
      style={[
        styles.avatarName,
        { color: isSelected ? theme.textPrimary : theme.textSecondary },
      ]}
    >
      {person.name}
    </Text>
  </TouchableOpacity>
);

interface InputWrapperProps {
  value: number;
  theme: AppTheme;
  onChange: (v: string) => void;
}

const InputWrapper = ({ value, theme, onChange }: InputWrapperProps) => (
  <View style={[styles.inputWrap, { backgroundColor: theme.background, borderColor: `${theme.border}40` }]}>
    <Text style={[styles.inputCurrency, { color: theme.brandPrimary }]}>₨</Text>
    <TextInput
      keyboardType="numeric"
      value={value === 0 ? "" : value.toString()}
      placeholder="0"
      placeholderTextColor={theme.textSecondary}
      onChangeText={onChange}
      style={[styles.smallInput, { color: theme.textPrimary }]}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 24, 
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  detailsGroup: { marginBottom: 32 },
  peopleScroll: { paddingVertical: 12, paddingHorizontal: 4, gap: 16, marginBottom: 32 },
  avatarWrap: { alignItems: "center", gap: 10 },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
  },
  avatarName: { fontSize: 13, fontWeight: "800" },
  addPersonWrap: { alignItems: "center", gap: 10 },
  addPersonCircle: {
    width: 68,
    height: 68,
    borderRadius: 22,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addPersonText: { fontSize: 13, fontWeight: "800" },
  splitsCard: { borderRadius: 24, paddingHorizontal: 20, paddingVertical: 8, marginBottom: 32, borderWidth: 1 },
  splitRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1 },
  splitName: { fontSize: 15, fontWeight: "800" },
  goalsCard: { borderRadius: 24, marginBottom: 20 },
  goalsContent: { paddingHorizontal: 20, paddingVertical: 8 },
  goalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 20 },
  goalInfo: { gap: 4 },
  goalName: { fontSize: 15, fontWeight: "800" },
  goalLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  inputWrap: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1 },
  inputCurrency: { fontSize: 13, fontWeight: "900", marginRight: 6 },
  smallInput: { fontWeight: "800", width: 70, textAlign: "right", fontSize: 16, minHeight: 24 },
  footer: { 
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    zIndex: 100,
    marginBottom: 80,
  },
});
