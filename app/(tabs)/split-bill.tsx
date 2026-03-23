import { useRouter } from "expo-router";
import { Calendar, ChevronLeft, Info, Plus, User, Users, Wallet } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AmountInput } from "../../components/AmountInput";
import { Card, CardContent } from "../../components/Card";
import HeaderBar from "../../components/HeaderBar";
import { PrimaryButton } from "../../components/PrimaryButton";
import { SectionHeader } from "../../components/SectionHeader";
import { SegmentTabs } from "../../components/SegmentTabs";
import type { AppTheme } from "../../constants/theme";
import { useTheme } from "../../hooks/useTheme";

interface Person {
  id: string;
  name: string;
  avatar?: string;
  shareValue: number; // Value depends on rule (amount, %, or count)
  calculatedAmount: number;
}

type SplitRule = "Equal" | "Percentage" | "Exact" | "Shares";

/* ================= SUB-COMPONENTS ================= */
const InputWrapper = ({
  value,
  theme,
  onChange,
  unit = "₨",
}: {
  value: number;
  theme: AppTheme;
  onChange: (v: string) => void;
  unit?: string;
}) => (
  <View style={[styles.inputWrap, { backgroundColor: theme.background, borderColor: `${theme.border}50` }]}>
    {unit === "₨" && <Text style={[styles.inputCurrency, { color: theme.brandPrimary }]}>₨</Text>}
    <TextInput
      keyboardType="numeric"
      value={value === 0 ? "" : value.toString()}
      placeholder="0"
      placeholderTextColor={theme.textSecondary}
      onChangeText={onChange}
      style={[styles.smallInput, { color: theme.textPrimary }]}
    />
    {unit !== "₨" && <Text style={[styles.inputCurrency, { color: theme.textSecondary, marginLeft: 4 }]}>{unit}</Text>}
  </View>
);

export default function SplitBillScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  /* ================= STATE ================= */
  const [totalAmount, setTotalAmount] = useState("");
  const [activeRule, setActiveRule] = useState<SplitRule>("Equal");
  const [account, setAccount] = useState("Global IME Bank");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [availablePeople] = useState([
    { id: "1", name: "Anish Magar" },
    { id: "2", name: "Suman KC" },
    { id: "3", name: "Rahul Sharma" },
    { id: "4", name: "Priya Thapa" },
    { id: "5", name: "Bibek Shah" },
  ]);
  const [selectedIds, setSelectedIds] = useState<string[]>(["1", "2"]);
  const [personValues, setPersonValues] = useState<Record<string, number>>({});

  /* ================= CALCULATIONS ================= */
  const billTotal = parseFloat(totalAmount) || 0;

  const splitBreakdown = useMemo(() => {
    const selected = availablePeople.filter(p => selectedIds.includes(p.id));
    if (selected.length === 0) return [];

    let breakdown: Person[] = [];

    if (activeRule === "Equal") {
      const perPerson = billTotal / selected.length;
      breakdown = selected.map(p => ({
        ...p,
        shareValue: 1,
        calculatedAmount: perPerson
      }));
    } else if (activeRule === "Percentage") {
      breakdown = selected.map(p => {
        const pct = personValues[p.id] || (100 / selected.length);
        return {
          ...p,
          shareValue: pct,
          calculatedAmount: (billTotal * pct) / 100
        };
      });
    } else if (activeRule === "Exact") {
      breakdown = selected.map(p => {
        const amt = personValues[p.id] || (billTotal / selected.length);
        return {
          ...p,
          shareValue: amt,
          calculatedAmount: amt
        };
      });
    } else if (activeRule === "Shares") {
      const totalShares = selected.reduce((sum, p) => sum + (personValues[p.id] || 1), 0);
      breakdown = selected.map(p => {
        const shares = personValues[p.id] || 1;
        return {
          ...p,
          shareValue: shares,
          calculatedAmount: totalShares > 0 ? (billTotal * shares) / totalShares : 0
        };
      });
    }

    return breakdown;
  }, [billTotal, selectedIds, activeRule, personValues]);

  const totalCalculated = splitBreakdown.reduce((sum, p) => sum + p.calculatedAmount, 0);
  const isBalanced = Math.abs(totalCalculated - billTotal) < 0.01 || activeRule === "Equal" || activeRule === "Shares";

  /* ================= ACTIONS ================= */
  const togglePerson = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const updatePersonValue = (id: string, val: string) => {
    const num = parseFloat(val) || 0;
    setPersonValues(prev => ({ ...prev, [id]: num }));
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      <HeaderBar
        theme={theme}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButtonStyle(theme)}>
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        title={<Text style={{ fontSize: 25, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5 }}>Split Bill</Text>}
        rightContent={<View style={{ width: 44 }} />}
      />

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 150, maxWidth: 500, alignSelf: 'center', width: '100%' }}>

        {/* ================= AMOUNT HERO ================= */}
        <AmountInput
          theme={theme}
          label="Total Bill Amount"
          value={totalAmount}
          onChangeText={setTotalAmount}
          color={theme.brandPrimary}
          autoFocus
        />

        {/* ================= ACCOUNT & DATE ================= */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
          <View style={{ flex: 1 }}>
            <SectionHeader theme={theme} title="Account" icon={<Wallet size={14} color={theme.textSecondary} />} variant="label" marginBottom={12} />
            <TouchableOpacity style={styles.selectStyle(theme)}>
              <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "600" }}>{account}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <SectionHeader theme={theme} title="Date" icon={<Calendar size={14} color={theme.textSecondary} />} variant="label" marginBottom={12} />
            <TouchableOpacity style={styles.selectStyle(theme)}>
              <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "600" }}>{date}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= PEOPLE SELECTION ================= */}
        <SectionHeader theme={theme} title="Who's involved?" icon={<Users size={16} color={theme.textSecondary} />} variant="label" marginBottom={12} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.peopleScroll}>
          {availablePeople.map(p => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <TouchableOpacity key={p.id} onPress={() => togglePerson(p.id)} style={styles.avatarWrap}>
                <View style={[
                  styles.avatarCircle,
                  {
                    backgroundColor: isSelected ? theme.brandPrimary : theme.surface,
                    borderColor: isSelected ? 'transparent' : `${theme.border}80`,
                    borderWidth: isSelected ? 0 : 1,
                    shadowColor: isSelected ? theme.brandPrimary : 'transparent',
                  }
                ]}>
                  <User size={30} color={isSelected ? "#FFF" : theme.textSecondary} />
                </View>
                <Text style={[styles.avatarName, { color: isSelected ? theme.textPrimary : theme.textSecondary }]}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={styles.addPersonWrap}>
            <View style={[styles.addPersonCircle, { borderColor: theme.border }]}>
              <Plus size={24} color={theme.textSecondary} />
            </View>
            <Text style={[styles.addPersonText, { color: theme.textSecondary }]}>Add</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={{ height: 32 }} />

        {/* ================= SPLIT RULE ================= */}
        <SectionHeader theme={theme} title="Splitting Rule" variant="label" marginBottom={16} />
        <SegmentTabs
          theme={theme}
          tabs={["Equal", "Percentage", "Exact", "Shares"]}
          active={activeRule}
          onChange={(t) => setActiveRule(t as SplitRule)}
        />

        <View style={{ height: 32 }} />

        {/* ================= BREAKDOWN ================= */}
        <SectionHeader theme={theme} title="Breakdown" variant="label" marginBottom={16} />
        {splitBreakdown.length > 0 ? (
          <Card theme={theme} style={styles.breakdownCard}>
            <CardContent theme={theme} style={styles.breakdownContent}>
              {splitBreakdown.map((p, idx) => (
                <View key={p.id} style={[
                  styles.splitRow,
                  { borderBottomColor: `${theme.border}30`, borderBottomWidth: idx === splitBreakdown.length - 1 ? 0 : 1 }
                ]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={styles.miniAvatarCircle(theme)}>
                      <User size={20} color={theme.textSecondary} />
                    </View>
                    <View>
                      <Text style={[styles.splitName, { color: theme.textPrimary }]}>{p.name}</Text>
                      <Text style={{ fontSize: 13, fontWeight: "800", color: theme.brandPrimary }}>
                        ₨ {p.calculatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Text>
                    </View>
                  </View>

                  {activeRule !== "Equal" ? (
                    <InputWrapper
                      value={personValues[p.id] || 0}
                      theme={theme}
                      unit={activeRule === "Percentage" ? "%" : activeRule === "Shares" ? "sh" : "₨"}
                      onChange={(v) => updatePersonValue(p.id, v)}
                    />
                  ) : null}
                </View>
              ))}
            </CardContent>
          </Card>
        ) : (
          <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
            <Users size={48} color={theme.textSecondary} strokeWidth={1} />
            <Text style={{ marginTop: 12, color: theme.textSecondary, fontWeight: "600" }}>Select people to see the split</Text>
          </View>
        )}

        {/* BALANCE INDICATOR */}
        {!isBalanced && billTotal > 0 && (
          <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: `${theme.danger}10`, padding: 12, borderRadius: 12 }}>
            <Info size={14} color={theme.danger} />
            <Text style={{ fontSize: 12, color: theme.danger, fontWeight: "600" }}>
              The split amounts don't sum up to the total bill. (Gap: ₨ {(billTotal - totalCalculated).toFixed(2)})
            </Text>
          </View>
        )}

      </ScrollView>

      {/* ================= FOOTER ================= */}
      <View style={{ position: "absolute", bottom: 72, paddingHorizontal: 24, paddingVertical: 20, backgroundColor: theme.background, borderTopWidth: 1, borderTopColor: `${theme.border}30`, width: '100%', maxWidth: 500, alignSelf: 'center' }}>
        <PrimaryButton
          theme={theme}
          title="Confirm Split"
          disabled={!isBalanced || billTotal === 0 || selectedIds.length === 0}
          onPress={() => router.back()}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = {
  headerButtonStyle: (theme: AppTheme) => ({
    width: 32, height: 32, borderRadius: 10, borderWidth: 1, borderColor: `${theme.border}80`,
    backgroundColor: theme.surface, alignItems: "center" as const, justifyContent: "center" as const,
  }),
  selectStyle: (theme: AppTheme) => ({
    width: "100%" as const, height: 52, paddingHorizontal: 16, borderRadius: 16, backgroundColor: theme.surface,
    borderWidth: 1, borderColor: `${theme.border}40`, justifyContent: "center" as const
  }),
  peopleScroll: { paddingVertical: 8, paddingHorizontal: 4, gap: 16, marginBottom: 24 },
  avatarWrap: { alignItems: "center" as const, gap: 10 },
  avatarCircle: {
    width: 64, height: 64, borderRadius: 32, alignItems: "center" as const, justifyContent: "center" as const,
    shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 4,
  },
  avatarName: { fontSize: 13, fontWeight: "700" as const },
  addPersonWrap: { alignItems: "center" as const, gap: 10 },
  addPersonCircle: {
    width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderStyle: "dashed" as const,
    alignItems: "center" as const, justifyContent: "center" as const,
  },
  addPersonText: { fontSize: 13, fontWeight: "700" as const },
  breakdownCard: { borderRadius: 24 },
  breakdownContent: { paddingHorizontal: 20, paddingVertical: 8 },
  splitRow: { flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "center" as const, paddingVertical: 16 },
  splitName: { fontSize: 15, fontWeight: "700" as const },
  miniAvatarCircle: (theme: AppTheme) => ({
    width: 40, height: 40, borderRadius: 14, backgroundColor: theme.surface, alignItems: 'center' as const, justifyContent: 'center' as const
  }),
  inputWrap: { flexDirection: "row" as const, alignItems: "center" as const, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 },
  inputCurrency: { fontSize: 12, fontWeight: "800" as const, marginRight: 4 },
  smallInput: { fontWeight: "700" as const, width: 60, textAlign: "right" as const, fontSize: 14, minHeight: 24 },
};
