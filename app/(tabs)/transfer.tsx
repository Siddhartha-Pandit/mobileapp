import React, { useState } from "react";
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
  ArrowDownUp,
  Wallet,
  Calendar,
  NotebookPen,
  ArrowRightLeft,
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { SectionHeader } from "../../components/SectionHeader";
import HeaderBar from "../../components/HeaderBar";
import { PrimaryButton } from "../../components/PrimaryButton";
import { FormDatePicker } from "../../components/FormDatePicker";
import { Platform } from "react-native";

export default function TransferMoneyScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // --- STATE ---
  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState("Standard Chartered Bank");
  const [toAccount, setToAccount] = useState("Cash in Hand");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // --- ACTIONS ---
  const handleSwap = () => {
    const temp = fromAccount;
    setFromAccount(toAccount);
    setToAccount(temp);
  };

  const handleConfirm = () => {
    // Logic for processing the transfer
    console.log({ amount, fromAccount, toAccount, note, date });
    router.back();
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ================= HEADER BAR ================= */}
      <HeaderBar
        theme={theme}
        title="Transfer"
        pageInfo="Move money between your own accounts or transfer to other financial destinations. Ensure both accounts are correctly selected before confirming."
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ================= AMOUNT INPUT ================= */}
        <View style={[styles.amountCard, { backgroundColor: theme.surface, borderColor: `${theme.border}50` }]}>
          <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>
            Transfer Amount
          </Text>
          <View style={styles.amountInputRow}>
            <Text style={[styles.currencySymbol, { color: theme.brandPrimary }]}>₨</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={theme.textSecondary}
              value={amount}
              onChangeText={setAmount}
              style={[styles.amountInput, { color: theme.textPrimary }]}
            />
          </View>
        </View>

        {/* ================= TRANSFER FLOW ================= */}
        <View style={styles.flowContainer}>
          {/* FROM ACCOUNT */}
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {/* Open account selector */}}
            style={[styles.accountSelector, { backgroundColor: theme.surface, borderColor: `${theme.border}40` }]}
          >
             <SectionHeader
               theme={theme}
               variant="label"
               title="From"
               icon={<Wallet size={16} color={theme.textSecondary} />}
               marginBottom={8}
             />
             <View style={styles.selectBtn}>
               <Text style={[styles.selectText, { color: theme.textPrimary }]}>{fromAccount}</Text>
             </View>
          </TouchableOpacity>

          {/* SWAP BUTTON */}
          <View style={styles.swapBtnWrapper}>
            <TouchableOpacity onPress={handleSwap} style={[styles.swapBtn, { backgroundColor: theme.brandPrimary, borderColor: theme.background, shadowColor: theme.brandPrimary }]}>
               <ArrowDownUp size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* TO ACCOUNT */}
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {/* Open account selector */}}
            style={[styles.accountSelector, { backgroundColor: theme.surface, borderColor: `${theme.border}40` }]}
          >
             <SectionHeader
               theme={theme}
               variant="label"
               title="To"
               icon={<ArrowRightLeft size={16} color={theme.textSecondary} />}
               marginBottom={8}
             />
             <View style={styles.selectBtn}>
               <Text style={[styles.selectText, { color: theme.textPrimary }]}>{toAccount}</Text>
             </View>
          </TouchableOpacity>
        </View>

        {/* ================= ADDITIONAL DETAILS ================= */}
        <View style={styles.detailsGroup}>
          <FormDatePicker
            label="Transfer Date"
            value={new Date(date)}
            onChange={(d) => setDate(d.toISOString().split("T")[0])}
            theme={theme}
          />

          <View>
            <SectionHeader
               theme={theme}
               variant="label"
               title="Note"
               icon={<NotebookPen size={16} color={theme.textSecondary} />}
               marginBottom={8}
             />
             <View style={[styles.textAreaBox, { backgroundColor: theme.surface, borderColor: `${theme.border}40` }]}>
               <TextInput 
                 multiline
                 numberOfLines={4}
                 placeholder="Reference (e.g. ATM Withdrawal)"
                 placeholderTextColor={theme.textSecondary}
                 value={note}
                 onChangeText={setNote}
                 style={[styles.inputText, { color: theme.textPrimary, height: 80, textAlignVertical: 'top' }]}
               />
             </View>
          </View>
        </View>
        
        {/* Added extra padding for the fixed footer */}
        <View style={{ height: 200 }} />
      </ScrollView>

      {/* ================= FOOTER BUTTON ================= */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton theme={theme} title="Confirm Transfer" onPress={handleConfirm} fullWidth />
      </View>
    </SafeAreaView>
  );
}

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
  headerTitle: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  scrollContent: { padding: 24, paddingBottom: 40, width: '100%', maxWidth: 500, alignSelf: 'center' },
  amountCard: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 1,
  },
  amountLabel: { fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  amountInputRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 12 },
  currencySymbol: { fontSize: 32, fontWeight: "800", marginRight: 8 },
  amountInput: { fontSize: 44, fontWeight: "800", minWidth: 180, maxWidth: 250, textAlign: 'center' },
  flowContainer: { position: "relative", gap: 12, marginBottom: 32 },
  accountSelector: { paddingVertical: 16, paddingHorizontal: 20, borderRadius: 24, borderWidth: 1 },
  selectBtn: { paddingVertical: 8 },
  selectText: { fontSize: 16, fontWeight: "700" },
  swapBtnWrapper: {
    position: 'absolute',
    right: 30,
    top: '50%',
    marginTop: -22,
    zIndex: 10,
  },
  swapBtn: {
    width: 44,
    height: 44,
    borderRadius: 15,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  detailsGroup: { gap: 24 },
  inputBox: { paddingVertical: 16, paddingHorizontal: 18, borderRadius: 18, borderWidth: 1 },
  textAreaBox: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 18, borderWidth: 1 },
  inputText: { fontSize: 15, fontWeight: "600" },
  footer: { 
    padding: 24, 
    paddingBottom: Platform.OS === 'ios' ? 40 : 24, 
    borderTopWidth: 1, 
    position: "absolute", 
    bottom: 80, 
    width: "100%",
    zIndex: 100,
  },
  submitButton: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  submitButtonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
