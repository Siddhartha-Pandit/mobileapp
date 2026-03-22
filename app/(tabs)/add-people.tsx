import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { ChevronLeft, User, Phone, Mail, NotebookPen, MapPin, CircleDollarSign } from "lucide-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppTheme } from "../../constants/theme";
import HeaderBar from "../../components/HeaderBar";
import { SectionHeader } from "../../components/SectionHeader";
import { useTheme } from "../../hooks/useTheme";

export default function AddPeopleScreen() {
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
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      {/* ================= HEADER ================= */}
      <HeaderBar
        theme={theme}
        title={<Text style={{ fontSize: 18, fontWeight: "800", color: theme.textPrimary }}>New Contact</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButtonStyle(theme)}>
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={<View style={{ width: 44 }} />}
      />

      {/* ================= CONTENT ================= */}
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100, maxWidth: 500, alignSelf: 'center', width: '100%' }}>
        
        {/* PROFILE ICON */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={{
            width: 90, height: 90, borderRadius: 32, backgroundColor: theme.surface,
            borderWidth: 1, borderColor: `${theme.border}40`, alignItems: "center", justifyContent: "center",
            shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5
          }}>
            <User size={44} color={theme.brandPrimary} />
          </View>
        </View>

        {/* ================= FORM ================= */}
        <View style={{ gap: 26 }}>
          
          {/* FULL NAME */}
          <View>
            <SectionHeader theme={theme} title="Full Name" icon={<User size={14} color={theme.textSecondary} />} variant="label" marginBottom={12} />
            <TextInput
              placeholder="e.g. Rahul Kumar"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
              style={styles.inputStyle(theme)}
            />
          </View>

          {/* OPENING BALANCE */}
          <View>
            <SectionHeader theme={theme} title="Opening Balance" icon={<CircleDollarSign size={14} color={theme.textSecondary} />} variant="label" marginBottom={12} />
            <View style={{ justifyContent: "center" }}>
              <Text style={{ position: "absolute", left: 18, fontWeight: "800", color: theme.brandPrimary, fontSize: 16 }}>₨</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={theme.textSecondary}
                value={initialBalance}
                onChangeText={setInitialBalance}
                style={[styles.inputStyle(theme), { paddingLeft: 45 }]}
              />
            </View>
          </View>

          {/* PHONE */}
          <View>
            <SectionHeader theme={theme} title="Phone Number" icon={<Phone size={14} color={theme.textSecondary} />} variant="label" marginBottom={12} />
            <TextInput
              keyboardType="phone-pad"
              placeholder="+977 9800000000"
              placeholderTextColor={theme.textSecondary}
              value={phone}
              onChangeText={setPhone}
              style={styles.inputStyle(theme)}
            />
          </View>

          {/* EMAIL */}
          <View>
            <SectionHeader theme={theme} title="Email" icon={<Mail size={14} color={theme.textSecondary} />} variant="label" marginBottom={12} />
            <TextInput
              keyboardType="email-address"
              placeholder="contact@email.com"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              style={styles.inputStyle(theme)}
            />
          </View>

          {/* LOCATION */}
          <View>
            <SectionHeader theme={theme} title="Location" icon={<MapPin size={14} color={theme.textSecondary} />} variant="label" marginBottom={12} />
            <TextInput
              placeholder="City or Neighborhood"
              placeholderTextColor={theme.textSecondary}
              value={location}
              onChangeText={setLocation}
              style={styles.inputStyle(theme)}
            />
          </View>

          {/* NOTE */}
          <View>
            <SectionHeader theme={theme} title="Personal Note" icon={<NotebookPen size={14} color={theme.textSecondary} />} variant="label" marginBottom={12} />
            <TextInput
              multiline
              textAlignVertical="top"
              placeholder="Birthdays, bank details, or context..."
              placeholderTextColor={theme.textSecondary}
              value={note}
              onChangeText={setNote}
              style={[styles.inputStyle(theme), { height: 100, paddingTop: 16 }]}
            />
          </View>

        </View>
      </ScrollView>

      {/* ================= FOOTER ================= */}
      <View style={{ position: "absolute", bottom: 72, paddingHorizontal: 24, paddingVertical: 20, backgroundColor: theme.background, borderTopWidth: 1, borderTopColor: `${theme.border}30`, width: '100%', maxWidth: 500, alignSelf: 'center' }}>
        <TouchableOpacity style={styles.confirmButtonStyle(theme)} onPress={() => router.back()}>
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Save Contact</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = {
  inputStyle: (theme: AppTheme) => ({
    width: "100%" as const, height: 56, paddingHorizontal: 18, borderRadius: 18, backgroundColor: theme.surface,
    borderWidth: 1, borderColor: `${theme.border}40`, color: theme.textPrimary, fontSize: 16, fontWeight: "600" as const,
  }),
  headerButtonStyle: (theme: AppTheme) => ({
    width: 44, height: 44, borderRadius: 14, borderWidth: 1, borderColor: `${theme.border}80`,
    backgroundColor: theme.surface, alignItems: "center" as const, justifyContent: "center" as const,
  }),
  confirmButtonStyle: (theme: AppTheme) => ({
    width: "100%" as const, paddingVertical: 20, borderRadius: 20, backgroundColor: theme.brandPrimary,
    alignItems: "center" as const, justifyContent: "center" as const,
    shadowColor: theme.brandPrimary, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 30, elevation: 6
  })
};
