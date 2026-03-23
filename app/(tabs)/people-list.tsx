import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Search, Plus, Users, TrendingUp, TrendingDown } from "lucide-react-native";

import HeaderBar from "../../components/HeaderBar";
import { Card, CardContent } from "../../components/Card";
import { useTheme } from "../../hooks/useTheme";
import type { AppTheme } from "../../constants/theme";

export default function PeopleListScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const people = [
    { id: 1, name: "Anish Magar", netBalance: 15000, lastUpdate: "2 days ago", avatar: "AM" },
    { id: 2, name: "Sita Sharma", netBalance: 5500, lastUpdate: "Sept 12", avatar: "SS" },
    { id: 3, name: "Rajesh Hamal", netBalance: -25000, lastUpdate: "Aug 28", avatar: "RH" },
    { id: 4, name: "Priyanka Karki", netBalance: -1200, lastUpdate: "Yesterday", avatar: "PK" },
    { id: 5, name: "Binod Chaudhary", netBalance: 50000, lastUpdate: "July 15", avatar: "BC" },
    { id: 6, name: "Deepak Bajracharya", netBalance: -3000, lastUpdate: "Oct 01", avatar: "DB" },
  ];

  const filteredPeople = people.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      <HeaderBar
        theme={theme}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButtonStyle(theme)}>
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        title={<Text style={{ fontSize: 18, fontWeight: "800", color: theme.textPrimary }}>My Contacts</Text>}
        rightContent={
          <TouchableOpacity onPress={() => router.push("/add-person")} style={styles.headerButtonStyle(theme)}>
            <Plus size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, maxWidth: 500, alignSelf: 'center', width: '100%' }}>
        
        {/* Search Bar */}
        <View style={{ marginVertical: 16, position: "relative", justifyContent: "center" }}>
          <View style={{ position: "absolute", left: 16, zIndex: 2 }}>
            <Search size={18} color={theme.textSecondary} />
          </View>
          <TextInput 
            placeholder="Search contact..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              width: "100%", height: 52, backgroundColor: theme.surface, borderWidth: 1, borderColor: `${theme.border}80`,
              borderRadius: 16, paddingLeft: 48, paddingRight: 16, fontSize: 15, color: theme.textPrimary, fontWeight: "500" as const,
              shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 2
            }}
          />
        </View>

        {/* PEOPLE LIST */}
        <View style={{ gap: 12 }}>
          {filteredPeople.map((person) => {
            const isReceivable = person.netBalance > 0;
            const absoluteAmount = Math.abs(person.netBalance);

            return (
              <TouchableOpacity key={person.id} activeOpacity={0.8} onPress={() => router.push(`/person-detail?id=${person.id}`)}>
                <Card theme={theme} style={{ borderRadius: 20 }}>
                  <CardContent theme={theme} style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 16 }}>
                    
                    {/* Avatar */}
                    <View style={{ 
                      width: 50, height: 50, borderRadius: 14, backgroundColor: theme.brandPrimary + "15",
                      alignItems: "center", justifyContent: "center"
                    }}>
                      <Text style={{ color: theme.brandPrimary, fontSize: 15, fontWeight: "800" }}>{person.avatar}</Text>
                    </View>

                    {/* Name and Quick Status */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: "700", color: theme.textPrimary, marginBottom: 4 }}>
                        {person.name}
                      </Text>
                      <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                        {person.lastUpdate}
                      </Text>
                    </View>

                    {/* Net Balance Amount */}
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ fontSize: 16, fontWeight: "900", color: isReceivable ? theme.brandPrimary : theme.danger, marginBottom: 2 }}>
                        ₨ {absoluteAmount.toLocaleString()}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        {isReceivable ? <TrendingUp size={12} color={theme.brandPrimary} /> : <TrendingDown size={12} color={theme.danger} />}
                        <Text style={{ fontSize: 10, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5, color: isReceivable ? theme.brandPrimary : theme.danger }}>
                          {isReceivable ? "Receive" : "Give"}
                        </Text>
                      </View>
                    </View>

                  </CardContent>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  headerButtonStyle: (theme: AppTheme) => ({
    width: 32, height: 32, borderRadius: 10, borderWidth: 1, borderColor: `${theme.border}80`,
    backgroundColor: theme.surface, alignItems: "center" as const, justifyContent: "center" as const
  })
};
