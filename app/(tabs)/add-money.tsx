import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Users,
  Target,
  Wallet,
  LayoutGrid,
  User,
  Plus,
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { SectionHeader } from "../../components/SectionHeader";
import HeaderBar from "../../components/HeaderBar";
import { Card, CardContent } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import type { AppTheme } from "../../constants/theme";

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
  const [category, setCategory] = useState("Salary");
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

  // --- ACTIONS ---
  const addNewPerson = () => {
    const newPerson = {
      id: Date.now().toString(),
      name: "New Person",
      amountContributed: 0,
    };
    setAvailablePeople((prev) => [...prev, newPerson]);
    setSelectedPeopleIds((prev) => [...prev, newPerson.id]);
    router.push('/add-person' as any);
  };

  const togglePerson = (id: string) => {
    setSelectedPeopleIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ================= HEADER BAR ================= */}
      <HeaderBar
        theme={theme}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { borderColor: theme.border, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        title={
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Add Money
          </Text>
        }
        rightContent={<View style={{ width: 40 }} />}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ================= AMOUNT INPUT ================= */}
        <View style={[styles.amountCard, { backgroundColor: theme.surface, borderColor: `${theme.border}50` }]}>
          <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>
            Total Amount
          </Text>
          <View style={styles.amountInputRow}>
            <Text style={[styles.currencySymbol, { color: theme.brandPrimary }]}>₨</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={theme.textSecondary}
              value={totalAmount}
              onChangeText={setTotalAmount}
              style={[styles.amountInput, { color: theme.textPrimary }]}
            />
          </View>
        </View>

        {/* ================= DETAILS ================= */}
        <View style={styles.detailsGroup}>
          <View>
            <SectionHeader
              theme={theme}
              variant="label"
              title="Account"
              icon={<Wallet size={16} color={theme.textSecondary} />}
              marginBottom={8}
            />
            <TouchableOpacity style={[styles.selectBox, { backgroundColor: theme.surface, borderColor: `${theme.border}80` }]}>
              <Text style={[styles.selectText, { color: theme.textPrimary }]}>Standard Chartered Bank</Text>
            </TouchableOpacity>
          </View>

          <View>
            <SectionHeader
              theme={theme}
              variant="label"
              title="Category"
              icon={<LayoutGrid size={16} color={theme.textSecondary} />}
              marginBottom={8}
            />
            <TouchableOpacity style={[styles.selectBox, { backgroundColor: theme.surface, borderColor: `${theme.border}80` }]}>
              <Text style={[styles.selectText, { color: theme.textPrimary }]}>{category}</Text>
            </TouchableOpacity>
          </View>
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
              onClick={() => togglePerson(p.id)}
              theme={theme}
            />
          ))}
          <TouchableOpacity onPress={addNewPerson} style={styles.addPersonWrap}>
            <View style={[styles.addPersonCircle, { borderColor: theme.border }]}>
              <Plus size={24} color={theme.textSecondary} />
            </View>
            <Text style={[styles.addPersonText, { color: theme.textSecondary }]}>Add</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ================= DYNAMIC SPLITS ================= */}
        {selectedPeopleIds.length > 0 && (
          <View style={[styles.splitsCard, { backgroundColor: theme.surface, borderColor: `${theme.border}50` }]}>
            {availablePeople
              .filter((p) => selectedPeopleIds.includes(p.id))
              .map((p) => (
                <View key={p.id} style={[styles.splitRow, { borderBottomColor: `${theme.border}30` }]}>
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
      <View style={[styles.footer, { position: "absolute", bottom: 72, backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          theme={theme}
          title="Confirm Transaction"
          onPress={() => router.back()}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

// --- REFINED SUB-COMPONENTS ---
const AvatarItem = ({
  person,
  isSelected,
  onClick,
  theme,
}: {
  person: Person;
  isSelected: boolean;
  onClick: () => void;
  theme: AppTheme;
}) => (
  <TouchableOpacity onPress={onClick} style={styles.avatarWrap}>
    <View
      style={[
        styles.avatarCircle,
        {
          backgroundColor: isSelected ? theme.brandPrimary : theme.surface,
          borderColor: isSelected ? 'transparent' : `${theme.border}80`,
          borderWidth: isSelected ? 0 : 1,
          shadowColor: isSelected ? theme.brandPrimary : 'transparent',
        },
      ]}
    >
      <User size={30} color={isSelected ? "#fff" : theme.textSecondary} />
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

const InputWrapper = ({
  value,
  theme,
  onChange,
}: {
  value: number;
  theme: AppTheme;
  onChange: (v: string) => void;
}) => (
  <View style={[styles.inputWrap, { backgroundColor: theme.background, borderColor: `${theme.border}50` }]}>
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
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 25, fontWeight: "800", letterSpacing: -0.5 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  amountCard: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.02,
    shadowRadius: 30,
    elevation: 2,
  },
  amountLabel: { fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  amountInputRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 12 },
  currencySymbol: { fontSize: 32, fontWeight: "800", marginRight: 8 },
  amountInput: { fontSize: 48, fontWeight: "800", minWidth: 180, maxWidth: 250, textAlign: 'center' },
  detailsGroup: { gap: 20, marginBottom: 32 },
  selectBox: {
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
  },
  selectText: { fontSize: 15, fontWeight: "600" },
  peopleScroll: { paddingVertical: 8, paddingHorizontal: 4, gap: 16, marginBottom: 24 },
  avatarWrap: { alignItems: "center", gap: 10 },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 4,
  },
  avatarName: { fontSize: 13, fontWeight: "700" },
  addPersonWrap: { alignItems: "center", gap: 10 },
  addPersonCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addPersonText: { fontSize: 13, fontWeight: "700" },
  splitsCard: { borderRadius: 24, paddingHorizontal: 20, paddingVertical: 8, marginBottom: 32, borderWidth: 1 },
  splitRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1 },
  splitName: { fontSize: 15, fontWeight: "700" },
  goalsCard: { marginBottom: 20 },
  goalsContent: { paddingHorizontal: 20, paddingVertical: 8 },
  goalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16 },
  goalInfo: { gap: 2 },
  goalName: { fontSize: 15, fontWeight: "700" },
  goalLabel: { fontSize: 11, fontWeight: "600", textTransform: "uppercase" },
  inputWrap: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  inputCurrency: { fontSize: 12, fontWeight: "800", marginRight: 4 },
  smallInput: { fontWeight: "700", width: 60, textAlign: "right", fontSize: 14, minHeight: 24 },
  footer: { padding: 24, paddingTop: 20, borderTopWidth: 1, position: "absolute", bottom: 90, width: "100%" },
  submitButton: {
    width: "100%",
    padding: 20,
    borderRadius: 18,
    alignItems: "center",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  submitButtonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
