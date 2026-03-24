import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Landmark,
  Wallet,
  Shield,
  Calendar,
  Layers,
  Coins,
  Percent,
  Folder,
  Info,
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import type { AppTheme } from "../../constants/theme";
import HeaderBar from "../../components/HeaderBar";
import { PrimaryButton } from "../../components/PrimaryButton";
import { CustomTabs } from "../../components/CustomTabs";

export default function BuySecuritiesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"securities" | "dividend">("securities");

  /* --- State Management --- */
  const [portfolio, setPortfolio] = useState("Long Term");
  const [securityType, setSecurityType] = useState("Stock");
  const [account, setAccount] = useState("HDFC Bank");
  const [symbol, setSymbol] = useState("NABIL");
  const [buyDate, setBuyDate] = useState(new Date().toISOString().split("T")[0]);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const qty = parseFloat(quantity) || 0;
  const unitPrice = parseFloat(price) || 0;
  const transactionAmount = qty * unitPrice;

  /* Calculation Logic */
  const brokerCommission = useMemo(() => {
    if (!transactionAmount) return 0;
    if (transactionAmount <= 50000) return Math.max(transactionAmount * 0.0036, 10);
    if (transactionAmount <= 500000) return transactionAmount * 0.0025;
    if (transactionAmount <= 2000000) return transactionAmount * 0.003;
    if (transactionAmount <= 10000000) return transactionAmount * 0.0027;
    return transactionAmount * 0.0024;
  }, [transactionAmount]);

  const sebonFee = transactionAmount * 0.00015;
  const dpCharge = transactionAmount > 0 ? 25 : 0;
  const totalBuyPrice = transactionAmount + brokerCommission + sebonFee + dpCharge;

  /* Dividend State */
  const [divPortfolio, setDivPortfolio] = useState("Long Term");
  const [divAccount, setDivAccount] = useState("HDFC Bank");
  const [divSymbol, setDivSymbol] = useState("NABIL");
  const [divDate, setDivDate] = useState(new Date().toISOString().split("T")[0]);
  const [sharesHeld, setSharesHeld] = useState("");
  const [cashPerShare, setCashPerShare] = useState("");
  const [bonusPercent, setBonusPercent] = useState("");

  const held = parseFloat(sharesHeld) || 0;
  const totalCash = held * (parseFloat(cashPerShare) || 0);

  const handleSubmit = () => {
    router.back();
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* HEADER */}
      <HeaderBar
        theme={theme}
        title={<Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Buy Securities</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        pageInfo="Buy securities and track your portfolio. Ensure your broker and SEBON fees are accurate."
      />

      {/* TABS */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
        <CustomTabs 
          theme={theme}
          options={[
            { value: "securities", label: "Add Securities" },
            { value: "dividend", label: "Dividend" }
          ]}
          activeTab={activeTab}
          onChange={(val) => setActiveTab(val as any)}
        />
      </View>

      {/* SCROLLABLE FORM */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === "securities" ? (
          <>
            <BigAmountCard theme={theme} amount={totalBuyPrice} label="Total Buy Price" />

            <SectionLabel icon={<Folder size={14} color={theme.brandPrimary} />} label="Portfolio" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={portfolio} onChangeText={setPortfolio} />

            <SectionLabel icon={<Shield size={14} color={theme.brandPrimary} />} label="Security Type" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={securityType} onChangeText={setSecurityType} />

            <SectionLabel icon={<Landmark size={14} color={theme.brandPrimary} />} label="Account" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={account} onChangeText={setAccount} />

            <SectionLabel icon={<Layers size={14} color={theme.brandPrimary} />} label="Symbol" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={symbol} onChangeText={setSymbol} />

            <SectionLabel icon={<Calendar size={14} color={theme.brandPrimary} />} label="Buy Date" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={buyDate} onChangeText={setBuyDate} />

            <SectionLabel icon={<Coins size={14} color={theme.brandPrimary} />} label="Quantity" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" placeholder="0.00" placeholderTextColor={theme.textSecondary} value={quantity} onChangeText={setQuantity} />

            <SectionLabel icon={<Wallet size={14} color={theme.brandPrimary} />} label="Price Per Share" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" placeholder="0.00" placeholderTextColor={theme.textSecondary} value={price} onChangeText={setPrice} />
            
            <BreakdownCard theme={theme} purchaseAmount={transactionAmount} broker={brokerCommission} sebon={sebonFee} dp={dpCharge} total={totalBuyPrice} />
          </>
        ) : (
          <>
            <BigAmountCard theme={theme} amount={totalCash} label="Total Cash Dividend" />

            <SectionLabel icon={<Folder size={14} color={theme.brandPrimary} />} label="Portfolio" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={divPortfolio} onChangeText={setDivPortfolio} />

            <SectionLabel icon={<Landmark size={14} color={theme.brandPrimary} />} label="Account" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={divAccount} onChangeText={setDivAccount} />

            <SectionLabel icon={<Layers size={14} color={theme.brandPrimary} />} label="Symbol" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={divSymbol} onChangeText={setDivSymbol} />

            <SectionLabel icon={<Calendar size={14} color={theme.brandPrimary} />} label="Dividend Date" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={divDate} onChangeText={setDivDate} />

            <SectionLabel icon={<Coins size={14} color={theme.brandPrimary} />} label="Shares Held" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" placeholder="0" placeholderTextColor={theme.textSecondary} value={sharesHeld} onChangeText={setSharesHeld} />

            <SectionLabel icon={<Wallet size={14} color={theme.brandPrimary} />} label="Cash Dividend / Share" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" placeholder="0.00" placeholderTextColor={theme.textSecondary} value={cashPerShare} onChangeText={setCashPerShare} />

            <SectionLabel icon={<Percent size={14} color={theme.brandPrimary} />} label="Bonus %" theme={theme} />
            <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" placeholder="0" placeholderTextColor={theme.textSecondary} value={bonusPercent} onChangeText={setBonusPercent} />
          </>
        )}
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { position: "absolute", bottom: 72, borderTopColor: theme.border, backgroundColor: theme.background }]}>
        <PrimaryButton title={activeTab === "securities" ? "Confirm Purchase" : "Save Dividend"} theme={theme} onPress={handleSubmit} fullWidth />
      </View>
    </SafeAreaView>
  );
}



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

const BreakdownCard = ({ theme, purchaseAmount, broker, sebon, dp, total }: any) => (
  <View style={[styles.breakdownCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <Row label="Purchase Amount" value={purchaseAmount} theme={theme} />
    <Row label="Broker Commission" value={broker} theme={theme} />
    <Row label="SEBON Fee" value={sebon} theme={theme} />
    <Row label="DP Charge" value={dp} theme={theme} />
    <View style={[styles.separator, { backgroundColor: theme.border }]} />
    <View style={styles.totalRow}>
      <Text style={[styles.totalText, { color: theme.textPrimary }]}>Total Payable</Text>
      <Text style={[styles.totalAmount, { color: theme.brandPrimary }]}>
        ₨ {total.toLocaleString("en-NP", { maximumFractionDigits: 2 })}
      </Text>
    </View>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  iconBtn: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  

  
  scrollContent: { padding: 24, paddingBottom: 180, maxWidth: 500, alignSelf: 'center', width: '100%' },
  
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
  separator: { height: 1, marginVertical: 12 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalText: { fontSize: 14, fontWeight: "800" },
  totalAmount: { fontSize: 16, fontWeight: "900" },
  
  footer: { padding: 24, borderTopWidth: 1, width: '100%', maxWidth: 500, alignSelf: 'center' }
});
