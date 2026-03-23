import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, Platform } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Wallet, StickyNote, Layers } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ColorPicker } from "../../components/ColorPicker";
import { ToggleSwitch } from "../../components/ToggleSwitch";
import { AmountInput } from "../../components/AmountInput";
import { FormInput } from "../../components/FormInput";
import { FormSelect } from "../../components/FormSelect";
import HeaderBar from "../../components/HeaderBar";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AddAccountScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [balance, setBalance] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Bank Account");
  const [notes, setNotes] = useState("");
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
    <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="Add Account"
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.subtitleBox}>
          <Text style={[styles.subtitleText, { color: theme.textSecondary }]}>
            Create a new account to track your balance.
          </Text>
        </View>

        {/* INITIAL BALANCE */}
        <AmountInput
          theme={theme}
          label="Initial Balance"
          value={balance}
          onChangeText={setBalance}
        />

        {/* ACCOUNT NAME */}
        <FormInput
          label="Account Name"
          value={name}
          onChangeText={setName}
          theme={theme}
          placeholder="e.g. Personal Savings"
          icon={<Wallet />}
        />

        {/* ACCOUNT TYPE */}
        <FormSelect
          label="Account Type"
          value={type}
          onSelect={setType}
          options={["Bank Account", "Cash Wallet", "Investment", "Credit Card", "Loan Account"]}
          theme={theme}
          icon={<Layers />}
        />

        {/* COLOR PICKER */}
        <View style={styles.colorSection}>
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>THEME COLOR</Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker theme={theme} colors={colors} selected={selectedColor} onChange={setSelectedColor} />
          </View>
        </View>

        {/* INCLUDE TOGGLE */}
        <View style={[styles.toggleBox, { backgroundColor: theme.surface, borderColor: `${theme.border}40` }]}>
          <View>
            <Text style={[styles.toggleTitle, { color: theme.textPrimary }]}>Include in total</Text>
            <Text style={[styles.toggleSubtitle, { color: theme.textSecondary }]}>Count in your net worth</Text>
          </View>
          <ToggleSwitch checked={includeInTotal} onChange={setIncludeInTotal} theme={theme} />
        </View>

        {/* NOTES */}
        <FormInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          theme={theme}
          placeholder="Add any details..."
          multiline
          icon={<StickyNote />}
        />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton title="Save Account" theme={theme} onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  subtitleBox: { paddingBottom: 24 },
  subtitleText: { fontSize: 13, fontWeight: "600", textAlign: 'center' },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 200, 
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  colorSection: { marginBottom: 32 },
  sectionLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2, marginBottom: 12, marginLeft: 4 },
  colorPickerContainer: { marginTop: 4 },
  toggleBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 32,
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
  },
  toggleTitle: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  toggleSubtitle: { fontSize: 12, fontWeight: "600" },
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
