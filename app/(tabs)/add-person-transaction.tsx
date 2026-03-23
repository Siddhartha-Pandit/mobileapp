import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  Platform 
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Wallet, NotebookPen } from "lucide-react-native";

import HeaderBar from "../../components/HeaderBar";
import { PrimaryButton } from "../../components/PrimaryButton";
import { AmountInput } from "../../components/AmountInput";
import { FormInput } from "../../components/FormInput";
import { FormSelect } from "../../components/FormSelect";
import { FormDatePicker } from "../../components/FormDatePicker";
import { useTheme } from "../../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AddPersonTransactionScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { personId, type } = useLocalSearchParams();
  
  const isGave = type === "gave";

  /* ================= STATE ================= */
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("Global IME Bank");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title={isGave ? "I Gave" : "I Got"}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* AMOUNT INPUT */}
        <AmountInput
          theme={theme}
          label="Transaction Amount"
          value={amount}
          onChangeText={setAmount}
          color={isGave ? theme.danger : theme.brandPrimary}
          autoFocus
        />

        {/* FORM FIELDS */}
        <View style={styles.formGroup}>
          <FormSelect
            label="From Account"
            value={account}
            onSelect={setAccount}
            options={["Global IME Bank", "Standard Chartered", "Cash Wallet"]}
            theme={theme}
            icon={<Wallet />}
          />

          <FormDatePicker
            label="Transaction Date"
            value={date}
            onChange={setDate}
            theme={theme}
          />

          <FormInput
            label="Personal Note"
            value={note}
            onChangeText={setNote}
            theme={theme}
            placeholder="What is this for?"
            multiline
            icon={<NotebookPen />}
          />
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton
          theme={theme}
          title={isGave ? "Confirm Payment" : "Confirm Receipt"}
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
  formGroup: { gap: 4 },
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
