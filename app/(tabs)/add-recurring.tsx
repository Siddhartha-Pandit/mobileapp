import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  Platform 
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Wallet, 
  Tag, 
  Zap, 
  Clock, 
  Calendar, 
  Activity 
} from "lucide-react-native";

import { useTheme } from "../../hooks/useTheme";
import HeaderBar from "../../components/HeaderBar";
import { SectionHeader } from "../../components/SectionHeader";
import { Card, CardContent } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { AmountInput } from "../../components/AmountInput";
import { FormInput } from "../../components/FormInput";
import { FormSelect } from "../../components/FormSelect";
import { FormDatePicker } from "../../components/FormDatePicker";
import { SegmentTabs } from "../../components/SegmentTabs";
import { ToggleSwitch } from "../../components/ToggleSwitch";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AddRecurringScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<"Income" | "Expense">("Expense");
  const [amount, setAmount] = useState<string>("");
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("Monthly");
  const [isAuto, setIsAuto] = useState(true);
  const [account, setAccount] = useState("Global IME Bank");
  const [startDate, setStartDate] = useState(new Date());

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Add Recurring"
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.introBox}>
          <Text style={[styles.introTitle, { color: theme.textPrimary }]}>Transaction Plan</Text>
          <Text style={[styles.introSub, { color: theme.textSecondary }]}>Manage your automated cash flow</Text>
        </View>

        {/* ================= TABS ================= */}
        <View style={styles.tabContainer}>
          <SegmentTabs
            theme={theme}
            tabs={["Expense", "Income"]}
            active={activeTab}
            onChange={(tab) => setActiveTab(tab as "Expense" | "Income")}
          />
        </View>

        {/* ================= AMOUNT ================= */}
        <AmountInput
          theme={theme}
          label={`Plan ${activeTab} Amount`}
          value={amount}
          onChangeText={setAmount}
          color={activeTab === "Expense" ? theme.danger : theme.brandPrimary}
        />

        {/* ================= BASIC INFO ================= */}
        <View style={styles.formGroup}>
          <FormInput
            label="Transaction Title"
            value={name}
            onChangeText={setName}
            theme={theme}
            placeholder={activeTab === "Expense" ? "e.g. Netflix Subscription" : "e.g. Monthly Salary"}
            icon={<Tag />}
          />

          <FormSelect
            label={activeTab === "Expense" ? "Pay From" : "Deposit To"}
            value={account}
            onSelect={setAccount}
            options={["Global IME Bank", "Standard Chartered", "HDFC Savings", "Cash Wallet"]}
            theme={theme}
            icon={<Wallet />}
          />
        </View>

        {/* ================= SCHEDULE ================= */}
        <SectionHeader theme={theme} title="Schedule Details" icon={<Clock size={16} color={theme.textSecondary} />} variant="label" marginBottom={12} />
        <Card theme={theme} style={styles.scheduleCard}>
          <CardContent theme={theme} style={styles.scheduleContent}>
            <View style={styles.row}>
              <View style={{ flex: 1.2 }}>
                <FormSelect
                  label="Frequency"
                  value={frequency}
                  onSelect={setFrequency}
                  options={["Daily", "Weekly", "Bi-Weekly", "Monthly", "Yearly"]}
                  theme={theme}
                  icon={<Activity />}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormDatePicker
                  label="Starting"
                  value={startDate}
                  onChange={setStartDate}
                  theme={theme}
                />
              </View>
            </View>

            {/* AUTO-EXECUTE TOGGLE */}
            <View style={[styles.toggleBox, { borderTopColor: `${theme.border}20` }]}>
              <View style={styles.toggleInfo}>
                <View style={styles.toggleTitleRow}>
                    <Zap size={14} color={theme.brandPrimary} style={{ marginRight: 6 }} />
                    <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Auto-Execute</Text>
                </View>
                <Text style={[styles.toggleSubtitle, { color: theme.textSecondary }]}>
                  Processed {frequency.toLowerCase()} automatically.
                </Text>
              </View>
              <ToggleSwitch checked={isAuto} onChange={setIsAuto} theme={theme} />
            </View>
          </CardContent>
        </Card>
      </ScrollView>

      {/* ================= FOOTER ================= */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          theme={theme}
          title={`Save ${activeTab} Plan`}
          onPress={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 220, 
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  introBox: { marginBottom: 32, alignItems: 'center' },
  introTitle: { fontSize: 32, fontWeight: "900", letterSpacing: -1 },
  introSub: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  tabContainer: { marginBottom: 36 },
  formGroup: { gap: 4, marginBottom: 32 },
  scheduleCard: { borderRadius: 28, marginBottom: 20 },
  scheduleContent: { padding: 20 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  toggleBox: { 
    marginTop: 12,
    paddingTop: 24, 
    borderTopWidth: 1, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between" 
  },
  toggleInfo: { flex: 1, paddingRight: 12 },
  toggleTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  toggleTitle: { fontSize: 15, fontWeight: "800" },
  toggleSubtitle: { fontSize: 12, fontWeight: "600", lineHeight: 18 },
  footer: { 
    position: "absolute", 
    bottom: 72, 
    left: 0, 
    right: 0, 
    padding: 24, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    zIndex: 100,
  },
});
