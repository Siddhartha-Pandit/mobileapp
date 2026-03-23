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
import { User, Phone, Mail, MapPin, NotebookPen } from "lucide-react-native";

import { useTheme } from "../../hooks/useTheme";
import HeaderBar from "../../components/HeaderBar";
import { AmountInput } from "../../components/AmountInput";
import { FormInput } from "../../components/FormInput";
import { PrimaryButton } from "../../components/PrimaryButton";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AddPersonScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  /* ================= STATE ================= */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar
        theme={theme}
        title="New Contact"
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PROFILE ICON */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarBox, { backgroundColor: theme.surface, borderColor: `${theme.border}40` }]}>
            <User size={48} color={theme.brandPrimary} />
          </View>
        </View>

        {/* OPENING BALANCE */}
        <AmountInput
          theme={theme}
          label="Opening Balance"
          value={initialBalance}
          onChangeText={setInitialBalance}
        />

        {/* FORM FIELDS */}
        <View style={styles.formGroup}>
          <FormInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            theme={theme}
            placeholder="e.g. Rahul Kumar"
            icon={<User />}
          />

          <FormInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            theme={theme}
            placeholder="+977 9800000000"
            keyboardType="phone-pad"
            icon={<Phone />}
          />

          <FormInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            theme={theme}
            placeholder="contact@email.com"
            keyboardType="email-address"
            icon={<Mail />}
          />

          <FormInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            theme={theme}
            placeholder="City or Neighborhood"
            icon={<MapPin />}
          />

          <FormInput
            label="Personal Note"
            value={note}
            onChangeText={setNote}
            theme={theme}
            placeholder="Birthdays, bank details, or context..."
            multiline
            icon={<NotebookPen />}
          />
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: `${theme.border}30` }]}>
        <PrimaryButton 
          theme={theme} 
          title="Save Contact" 
          onPress={() => router.back()}
          disabled={!name}
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
  avatarSection: { alignItems: "center", marginBottom: 32 },
  avatarBox: {
    width: 100,
    height: 100,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
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
