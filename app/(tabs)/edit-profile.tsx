import { useRouter } from "expo-router";
import { AlertTriangle, Briefcase, ChevronLeft, Lock, MoreVertical, User } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../components/Avatar";
import { Card, CardContent } from "../../components/Card";
import HeaderBar from "../../components/HeaderBar";
import { PrimaryButton } from "../../components/PrimaryButton";
import { useTheme } from "../../hooks/useTheme";

export default function EditProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  // --- STATE ---
  const [name, setName] = useState("Alexander Sterling");
  const [occupation, setOccupation] = useState("Senior Product Designer");
  const [gender, setGender] = useState("Male");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const genders = ["Male", "Female", "Other", "Secret"];

  const navigateChangePassword = () => {
    router.push('/change-password' as any);
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ================= FIXED HEADER ================= */}
      <HeaderBar
        theme={theme}
        title={<Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Edit Profile</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <TouchableOpacity style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <MoreVertical size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      {/* ================= SCROLLABLE FORM ================= */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Avatar theme={theme} name={name} editable onEdit={() => { }} />
        </View>

        <View style={styles.formGroup}>

          {/* PERSONAL INFORMATION CARD */}
          <Card theme={theme}>
            <CardContent theme={theme} style={styles.cardPadding}>

              {/* Full Name */}
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>FULL NAME</Text>
                <View style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.background, borderColor: focusedField === 'name' ? theme.brandPrimary : `${theme.border}80` }
                ]}>
                  <User size={18} color={theme.textSecondary} />
                  <TextInput
                    value={name}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={setName}
                    style={[styles.input, { color: theme.textPrimary }]}
                    placeholder="Enter your full name"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              </View>

              {/* Occupation */}
              <View style={[styles.fieldGroup, { marginTop: 24 }]}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>OCCUPATION</Text>
                <View style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.background, borderColor: focusedField === 'job' ? theme.brandPrimary : `${theme.border}80` }
                ]}>
                  <Briefcase size={18} color={theme.textSecondary} />
                  <TextInput
                    value={occupation}
                    onFocus={() => setFocusedField('job')}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={setOccupation}
                    style={[styles.input, { color: theme.textPrimary }]}
                    placeholder="e.g. Product Manager"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              </View>

            </CardContent>
          </Card>

          {/* GENDER SELECTOR CARD */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: theme.textSecondary, marginBottom: 10, alignSelf: 'flex-start' }]}>GENDER SELECTION</Text>
            <Card theme={theme}>
              <CardContent theme={theme} style={styles.genderCardContent}>
                <View style={styles.genderGrid}>
                  {genders.map((g) => {
                    const isSelected = gender === g;
                    return (
                      <TouchableOpacity
                        key={g}
                        onPress={() => setGender(g)}
                        style={[
                          styles.genderBtn,
                          { backgroundColor: isSelected ? `${theme.brandPrimary}15` : 'transparent' }
                        ]}
                      >
                        <View style={[
                          styles.radioCircle,
                          { borderColor: isSelected ? theme.brandPrimary : theme.border, backgroundColor: theme.background }
                        ]}>
                          {isSelected && <View style={[styles.radioDot, { backgroundColor: theme.brandPrimary }]} />}
                        </View>
                        <Text style={[
                          styles.genderText,
                          { color: isSelected ? theme.textPrimary : theme.textSecondary, fontWeight: isSelected ? "800" : "500" }
                        ]}>
                          {g}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </CardContent>
            </Card>
          </View>

          {/* SECURITY ZONE CARD */}
          <Card theme={theme} style={{ borderColor: theme.danger || "#EF4444", borderWidth: 1, backgroundColor: `${theme.danger || "#EF4444"}05` }}>
            <CardContent theme={theme} style={styles.cardPadding}>
              <View style={styles.securityHeader}>
                <AlertTriangle size={18} color={theme.danger || "#EF4444"} />
                <Text style={[styles.securityLabel, { color: theme.danger || "#EF4444" }]}>SECURITY SETTINGS</Text>
              </View>

              <TouchableOpacity
                style={[styles.securityBtn, { borderColor: theme.danger || "#EF4444" }]}
                onPress={navigateChangePassword}
              >
                <Lock size={16} color={theme.danger || "#EF4444"} />
                <Text style={[styles.securityBtnText, { color: theme.danger || "#EF4444" }]}>Change Password</Text>
              </TouchableOpacity>
            </CardContent>
          </Card>

        </View>
      </ScrollView>

      {/* ================= FIXED FOOTER BUTTON ================= */}
      <View style={[styles.footer, { position: "absolute", bottom: 72, backgroundColor: theme.background, borderTopColor: `${theme.border}40` }]}>
        <PrimaryButton
          title="Save Changes"
          theme={theme}
          style={styles.saveBtn}
          onPress={() => router.back()}
        />
      </View>
    </SafeAreaView>
  );
}

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
  scrollContent: { padding: 24, paddingBottom: 140, maxWidth: 500, alignSelf: 'center', width: '100%' },
  avatarSection: { alignItems: "center", marginVertical: 32 },
  formGroup: { gap: 24 },
  cardPadding: { padding: 24 },
  fieldGroup: { flexDirection: "column", gap: 8 },
  label: { fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1.2, marginLeft: 4 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    height: 58,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  input: { flex: 1, height: "100%", fontSize: 15, fontWeight: "700" },
  genderCardContent: { padding: 20 },
  genderGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 16 },
  genderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    width: '46%',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  genderText: { fontSize: 14 },
  securityHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  securityLabel: { fontWeight: "900", fontSize: 11, letterSpacing: 1.5 },
  securityBtn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  securityBtnText: { fontWeight: "800", fontSize: 15 },
  footer: {
    position: "absolute",
    bottom: 90,
    width: "100%",
    padding: 24,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  saveBtn: { width: "100%", height: 58, borderRadius: 18 },
});
