import React, { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Coins, Scale, TrendingUp, Calendar, Landmark, Wallet, Info, Layers } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import type { AppTheme } from "../../constants/theme";
import HeaderBar from "../../components/HeaderBar";
import { SectionHeader } from "../../components/SectionHeader";
import { PrimaryButton } from "../../components/PrimaryButton";
import { FormSelect } from "../../components/FormSelect";

export default function SellGoldScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  /* --- State Management --- */
  const [assetType, setAssetType] = useState("Gold");
  const [unit, setUnit] = useState<"tola" | "gram">("tola");
  const [sellRate, setSellRate] = useState(""); 
  const [buyRate, setBuyRate] = useState("");   
  const [quantity, setQuantity] = useState("");
  const [account, setAccount] = useState("Bank Account");
  const [sellDate, setSellDate] = useState(new Date().toISOString().split("T")[0]);

  /* --- Calculation Logic --- */
  const TOLA_TO_GRAM = 11.664;
  const qty = parseFloat(quantity) || 0;
  const sRate = parseFloat(sellRate) || 0;
  const bRate = parseFloat(buyRate) || 0;

  const receivable = useMemo(() => {
    return unit === "tola" ? qty * sRate : qty * (sRate / TOLA_TO_GRAM);
  }, [qty, sRate, unit]);

  const profit = useMemo(() => {
    const diff = sRate - bRate;
    return unit === "tola" ? diff * qty : (diff / TOLA_TO_GRAM) * qty;
  }, [qty, sRate, bRate, unit]);

  const handleSubmit = () => {
    router.back();
  };

  const assetPrices = { Gold: "1,65,000", Silver: "1,800" };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title={<Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Sell {assetType}</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        pageInfo={`Today's Rate:\nGold: ₨ 1,65,000\nSilver: ₨ 1,800\n\nCalculate your profit or loss when selling your gold and silver assets.`}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BigAmountCard theme={theme} amount={receivable} label="Net Amount Receivable" />

        <FormSelect
          theme={theme}
          label="Asset Type"
          value={assetType}
          onSelect={setAssetType}
          options={["Gold", "Silver"]}
          icon={<Layers size={18} color={theme.textSecondary} />}
        />

        <SectionHeader theme={theme} variant="label" title="Unit Type" icon={<Scale size={16} color={theme.brandPrimary} />} marginBottom={8} />
        <View style={styles.chipRow}>
          {["tola", "gram"].map((u) => (
            <TouchableOpacity 
              key={u} 
              onPress={() => setUnit(u as any)} 
              style={[
                styles.chip, 
                { 
                  backgroundColor: unit === u ? theme.brandPrimary : theme.surface,
                  borderColor: unit === u ? theme.brandPrimary : theme.border 
                }
              ]}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: unit === u ? "#fff" : theme.textSecondary }}>
                {u.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader theme={theme} variant="label" title="Selling Rate (per Tola)" icon={<TrendingUp size={16} color={theme.brandPrimary} />} marginBottom={8} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" placeholder="0.00" placeholderTextColor={theme.textSecondary} value={sellRate} onChangeText={setSellRate} />

        <SectionHeader theme={theme} variant="label" title={`Quantity (${unit})`} icon={<Coins size={16} color={theme.brandPrimary} />} marginBottom={8} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" placeholder="0.00" placeholderTextColor={theme.textSecondary} value={quantity} onChangeText={setQuantity} />

        <SectionHeader theme={theme} variant="label" title="Receive In" icon={<Landmark size={16} color={theme.brandPrimary} />} marginBottom={8} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={account} onChangeText={setAccount} />

        <SectionHeader theme={theme} variant="label" title="Sell Date" icon={<Calendar size={16} color={theme.brandPrimary} />} marginBottom={8} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} value={sellDate} onChangeText={setSellDate} />

        <SectionHeader theme={theme} variant="label" title="Original Buy Rate (per Tola)" icon={<Wallet size={16} color={theme.brandPrimary} />} marginBottom={8} />
        <TextInput style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }]} keyboardType="numeric" placeholder="To see Profit/Loss" placeholderTextColor={theme.textSecondary} value={buyRate} onChangeText={setBuyRate} />

        {qty > 0 && bRate > 0 && (
          <View style={[styles.profitCard, { backgroundColor: profit >= 0 ? "#10b98115" : `${theme.danger}15`, borderColor: profit >= 0 ? "#10b98130" : `${theme.danger}30` }]}>
            <Text style={{ fontSize: 13, color: profit >= 0 ? "#10b981" : theme.danger, fontWeight: '600' }}>
              Estimated {profit >= 0 ? 'Profit' : 'Loss'}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: profit >= 0 ? "#10b981" : theme.danger }}>
              ₨ {Math.abs(profit).toLocaleString("en-NP", { maximumFractionDigits: 2 })}
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { position: "absolute", bottom: 72, borderTopColor: theme.border, backgroundColor: theme.background }]}>
        <PrimaryButton title="Confirm Sale" theme={theme} onPress={handleSubmit} fullWidth />
      </View>
    </SafeAreaView>
  );
}

const BigAmountCard = ({ theme, amount, label }: any) => (
  <View style={[styles.bigCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <Text style={[styles.bigCardLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.bigCardAmount, { color: theme.brandPrimary }]}>
      ₨ {amount.toLocaleString("en-NP", { maximumFractionDigits: 2 })}
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
  
  chipRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  chip: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 16,
  },
  
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  
  profitCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 8 },
  
  footer: { padding: 24, borderTopWidth: 1, width: '100%', maxWidth: 500, alignSelf: 'center' },
  dangerBtn: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dangerBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
