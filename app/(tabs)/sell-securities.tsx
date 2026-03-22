import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Landmark,
  Wallet,
  Layers,
  Coins,
  Percent,
  Folder,
  Calendar,
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import type { AppTheme } from "../../constants/theme";
import HeaderBar from "../../components/HeaderBar";
import { PrimaryButton } from "../../components/PrimaryButton";

export default function SellSecuritiesScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  /* ================= STATE ================= */
  const [portfolio, setPortfolio] = useState("Long Term");
  const [account, setAccount] = useState("HDFC Bank");
  const [symbol, setSymbol] = useState("NABIL");
  const [sellDate, setSellDate] = useState(new Date().toISOString().split("T")[0]);

  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [cgtRate, setCgtRate] = useState("7.5");

  const qty = parseFloat(quantity) || 0;
  const buyUnit = parseFloat(buyPrice) || 0;
  const sellUnit = parseFloat(sellPrice) || 0;
  const cgt = parseFloat(cgtRate) || 0;

  /* ================= CALCULATIONS ================= */
  const sellAmount = qty * sellUnit;
  const buyAmount = qty * buyUnit;
  const capitalGain = sellAmount - buyAmount;

  const brokerCommission = useMemo(() => {
    if (!sellAmount) return 0;
    if (sellAmount <= 50000) return Math.max(sellAmount * 0.0036, 10);
    if (sellAmount <= 500000) return sellAmount * 0.0025;
    if (sellAmount <= 2000000) return sellAmount * 0.003;
    if (sellAmount <= 10000000) return sellAmount * 0.0027;
    return sellAmount * 0.0024;
  }, [sellAmount]);

  const sebonFee = sellAmount * 0.00015;
  const dpCharge = sellAmount > 0 ? 25 : 0;
  const capitalGainTax = capitalGain > 0 ? (capitalGain * cgt) / 100 : 0;
  const totalCharges = brokerCommission + sebonFee + dpCharge + capitalGainTax;
  const netReceivable = sellAmount - totalCharges;

  const handleSubmit = () => {
    router.back();
  };

  /* ================= UI ================= */
  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <HeaderBar
        theme={theme}
        title={<Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Sell Securities</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={<View style={{ width: 44 }} />}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BigAmountCard theme={theme} amount={netReceivable} label="Net Amount Receivable" />

        <SectionLabel icon={<Folder size={14} color={theme.brandPrimary} />} label="Portfolio" theme={theme} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={portfolio} onChangeText={setPortfolio} />

        <SectionLabel icon={<Landmark size={14} color={theme.brandPrimary} />} label="Account" theme={theme} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={account} onChangeText={setAccount} />

        <SectionLabel icon={<Layers size={14} color={theme.brandPrimary} />} label="Symbol" theme={theme} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={symbol} onChangeText={setSymbol} />

        <SectionLabel icon={<Calendar size={14} color={theme.brandPrimary} />} label="Sell Date" theme={theme} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={sellDate} onChangeText={setSellDate} />

        <SectionLabel icon={<Coins size={14} color={theme.brandPrimary} />} label="Quantity" theme={theme} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" placeholder="0" placeholderTextColor={theme.textSecondary} value={quantity} onChangeText={setQuantity} />

        <SectionLabel icon={<Wallet size={14} color={theme.brandPrimary} />} label="Buy Price Per Share" theme={theme} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" placeholder="0.00" placeholderTextColor={theme.textSecondary} value={buyPrice} onChangeText={setBuyPrice} />

        <SectionLabel icon={<Wallet size={14} color={theme.brandPrimary} />} label="Sell Price Per Share" theme={theme} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" placeholder="0.00" placeholderTextColor={theme.textSecondary} value={sellPrice} onChangeText={setSellPrice} />

        <SectionLabel icon={<Percent size={14} color={theme.brandPrimary} />} label="Capital Gain Tax Rate (%)" theme={theme} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" placeholder="7.5" placeholderTextColor={theme.textSecondary} value={cgtRate} onChangeText={setCgtRate} />

        {/* BREAKDOWN CARD */}
        <BreakdownCard theme={theme} broker={brokerCommission} sebon={sebonFee} dp={dpCharge} gain={capitalGain} tax={capitalGainTax} />
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { position: "absolute", bottom: 72, borderTopColor: theme.border, backgroundColor: theme.background }]}>
        <PrimaryButton title="Confirm Sell" theme={theme} onPress={handleSubmit} fullWidth />
      </View>
    </SafeAreaView>
  );
}

/* ================= COMPONENTS ================= */
const SectionLabel = ({ icon, label, theme }: any) => (
  <View style={styles.sectionLabelRow}>
    {icon}
    <Text style={[styles.sectionLabelText, { color: theme.textSecondary }]}>{label}</Text>
  </View>
);

const BigAmountCard = ({ theme, amount, label }: any) => (
  <View style={[styles.bigCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <Text style={[styles.bigCardLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.bigCardAmount, { color: theme.brandPrimary }]}>
      ₨ {amount.toLocaleString("en-NP", { maximumFractionDigits: 2 })}
    </Text>
  </View>
);

const BreakdownCard = ({ theme, broker, sebon, dp, gain, tax }: any) => (
  <View style={[styles.breakdownCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <Row label="Broker Commission" value={broker} theme={theme} />
    <Row label="SEBON Fee" value={sebon} theme={theme} />
    <Row label="DP Charge" value={dp} theme={theme} />
    <Row label="Capital Gain" value={gain} theme={theme} />
    <Row label="Capital Gain Tax" value={tax} theme={theme} />
  </View>
);

const Row = ({ label, value, theme }: any) => (
  <View style={styles.row}>
    <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.rowAmount, { color: theme.textPrimary }]}>
      ₨ {value.toLocaleString("en-NP", { maximumFractionDigits: 2 })}
    </Text>
  </View>
);

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  iconBtn: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  
  scrollContent: { padding: 24, paddingBottom: 120, maxWidth: 500, alignSelf: 'center', width: '100%' },
  
  bigCard: { padding: 20, borderRadius: 20, borderWidth: 1, alignItems: "center", marginVertical: 12 },
  bigCardLabel: { fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1 },
  bigCardAmount: { fontSize: 32, fontWeight: "900", marginTop: 4 },
  
  sectionLabelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 18, marginBottom: 8, marginLeft: 4 },
  sectionLabelText: { fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },
  
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: "600",
  },
  
  breakdownCard: { padding: 18, borderRadius: 18, borderWidth: 1, marginTop: 24 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  rowLabel: { fontSize: 13, fontWeight: "500" },
  rowAmount: { fontSize: 14, fontWeight: "600" },
  
  footer: { padding: 24, borderTopWidth: 1, width: '100%', maxWidth: 500, alignSelf: 'center' }
});
