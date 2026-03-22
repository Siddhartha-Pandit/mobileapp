import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Wallet, ChevronDown, StickyNote } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import type { AppTheme } from "../../constants/theme";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ColorPicker } from "../../components/ColorPicker";
import { ToggleSwitch } from "../../components/ToggleSwitch";
import HeaderBar from "../../components/HeaderBar";

export default function AddAccountScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [balance, setBalance] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("🏦 Bank Account");
  const [selectedColor, setSelectedColor] = useState("#1152d4");
  const [includeInTotal, setIncludeInTotal] = useState(true);

  const colors = [
    "#1152d4", "#10b981", "#f43f5e", "#f59e0b",
    "#6366f1", "#a855f7", "#64748b", "#f97316",
  ];

  const handleSave = () => {
    if (!name || !balance) return;
    router.back();
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title={<Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Add Account</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={<View style={{ width: 44 }} />}
      />

      <View style={styles.subtitleBox}>
        <Text style={[styles.subtitleText, { color: theme.textSecondary }]}>
          Create a new account to track your balance.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* INITIAL BALANCE */}
        <View style={[styles.balanceBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>INITIAL BALANCE</Text>
          <View style={styles.balanceInputRow}>
            <Text style={[styles.currencySymbol, { color: theme.brandPrimary }]}>₨</Text>
            <TextInput
              style={[styles.balanceInput, { color: theme.textPrimary }]}
              placeholder="0.00"
              placeholderTextColor={theme.textSecondary}
              value={balance}
              onChangeText={setBalance}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* ACCOUNT NAME */}
        <FormField theme={theme} label="Account Name" icon={<Wallet size={18} color={theme.textSecondary} />}>
          <TextInput
            placeholder="e.g. Personal Savings"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
            style={[styles.inputField, { color: theme.textPrimary }]}
          />
        </FormField>

        {/* ACCOUNT TYPE DUMMY BTN */}
        <FormField theme={theme} label="Account Type" icon={<ChevronDown size={18} color={theme.textSecondary} />}>
           <TextInput
            placeholder="Type"
            placeholderTextColor={theme.textSecondary}
            value={type}
            onChangeText={setType}
            style={[styles.inputField, { color: theme.textPrimary }]}
          />
        </FormField>

        {/* COLOR PICKER */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.labelStyle, { color: theme.textSecondary }]}>Theme Color</Text>
          <View style={{ marginTop: 12 }}>
            <ColorPicker theme={theme} colors={colors} selected={selectedColor} onChange={setSelectedColor} />
          </View>
        </View>

        {/* INCLUDE TOGGLE */}
        <View style={[styles.toggleBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View>
            <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Include in total</Text>
            <Text style={[styles.toggleSubtitle, { color: theme.textSecondary }]}>Count in your net worth</Text>
          </View>
          <ToggleSwitch checked={includeInTotal} onChange={setIncludeInTotal} theme={theme} />
        </View>

        {/* NOTES */}
        <FormField theme={theme} label="Notes" icon={<StickyNote size={18} color={theme.textSecondary} />}>
          <TextInput
            placeholder="Add any details..."
            placeholderTextColor={theme.textSecondary}
            multiline
            style={[styles.inputField, { color: theme.textPrimary, height: 80, textAlignVertical: 'top' }]}
          />
        </FormField>
      </ScrollView>

      <View style={[styles.footer, { position: "absolute", bottom: 72, borderTopColor: theme.border, backgroundColor: theme.background }]}>
        <PrimaryButton title="Save Account" theme={theme} onPress={handleSave} fullWidth />
      </View>
    </SafeAreaView>
  );
}

const FormField = ({ theme, label, icon, children }: any) => (
  <View style={styles.fieldContainer}>
    <Text style={[styles.labelStyle, { color: theme.textSecondary }]}>{label}</Text>
    <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.surface }]}>
      {icon}
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitleBox: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  subtitleText: { fontSize: 13, fontWeight: "600" },
  scrollContent: { padding: 24, paddingBottom: 100, gap: 24, maxWidth: 500, alignSelf: 'center', width: '100%' },
  
  balanceBox: { padding: 28, borderRadius: 20, borderWidth: 1, alignItems: "center" },
  balanceLabel: { fontSize: 11, fontWeight: "800", marginBottom: 8, letterSpacing: 1 },
  balanceInputRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  currencySymbol: { fontSize: 26, fontWeight: "700" },
  balanceInput: { fontSize: 36, fontWeight: "800", minWidth: 120, textAlign: "center", padding: 0 },

  fieldContainer: { width: "100%" },
  labelStyle: { fontSize: 11, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, marginLeft: 4 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  inputField: { flex: 1, fontSize: 15, fontWeight: "600", paddingVertical: 4 },

  toggleBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  toggleTitle: { fontSize: 14, fontWeight: "700", marginBottom: 4 },
  toggleSubtitle: { fontSize: 12 },

  footer: { padding: 24, borderTopWidth: 1, width: '100%', maxWidth: 500, alignSelf: 'center' }
});
