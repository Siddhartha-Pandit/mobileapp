import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Plus, Briefcase, Home, MoreHorizontal, TrendingUp, TrendingDown, ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import HeaderBar from "../../components/HeaderBar";
import { SectionHeader } from "../../components/SectionHeader";
import { Card, CardContent } from "../../components/Card";
import { useTheme } from "../../hooks/useTheme";
import type { AppTheme } from "../../constants/theme";

/* -------------------------------------------------------------------------- */
/* REUSABLE SUB-COMPONENTS                                                    */
/* -------------------------------------------------------------------------- */

const SummaryCard = ({ label, value, trend, isLoss, theme }: { label: string, value: string, trend: string, isLoss?: boolean, theme: AppTheme }) => (
  <Card theme={theme} style={{ flex: 1, borderRadius: 24 }}>
    <CardContent theme={theme} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <View style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Text style={{ fontSize: 10, fontWeight: "800", color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {label}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "900", color: theme.textPrimary, letterSpacing: -0.5 }}>
          {value}
        </Text>
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View style={{
          alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 6,
          backgroundColor: isLoss ? `${theme.danger}15` : `${theme.brandPrimary}15`
        }}>
          {isLoss ? <TrendingDown size={12} color={theme.danger} /> : <TrendingUp size={12} color={theme.brandPrimary} />}
        </View>
        <Text style={{ fontSize: 13, fontWeight: "800", color: isLoss ? theme.danger : theme.brandPrimary }}>
          {trend}
        </Text>
      </View>
    </CardContent>
  </Card>
);

const TransactionItem = ({ item, theme }: { item: any, theme: AppTheme }) => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(`/recurring-detail?id=${item.id}`)}>
      <Card theme={theme} style={{ marginBottom: 12, borderRadius: 24 }}>
        <CardContent theme={theme} style={{ paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{
            width: 48, height: 48, borderRadius: 16, backgroundColor: `${theme.brandPrimary}15`,
            alignItems: 'center', justifyContent: 'center'
          }}>
            {item.icon === 'work' ? <Briefcase size={22} color={theme.brandPrimary} /> : <Home size={22} color={theme.brandPrimary} />}
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <Text style={{ fontWeight: "800", fontSize: 16, color: theme.textPrimary }}>
                {item.name}
              </Text>
              <View style={{ 
                backgroundColor: item.tag === 'Manual' ? `${theme.warning}20` : `${theme.brandPrimary}20`, 
                paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 
              }}>
                <Text style={{ 
                  fontSize: 9, fontWeight: "900", 
                  color: item.tag === 'Manual' ? theme.warning : theme.brandPrimary, 
                  textTransform: 'uppercase'
                }}>
                  {item.tag}
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2, fontWeight: "600" }}>
              Next: March 1st
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontWeight: "900", fontSize: 17, color: item.type === 'income' ? theme.brandPrimary : theme.textPrimary }}>
              {item.type === 'income' ? '+' : '-'}{item.value}
            </Text>
            <TouchableOpacity style={{ paddingVertical: 4 }}>
              <MoreHorizontal size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN SCREEN                                                                */
/* -------------------------------------------------------------------------- */

export default function RecurringTransactionsScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const [data] = useState([
    { id: 1, name: "Monthly Salary", type: "income", value: "$3,000.00", icon: "work", tag: "Auto-Pay" },
    { id: 2, name: "Apartment Rent", type: "expense", value: "$1,200.00", icon: "home", tag: "Auto-Pay" },
    { id: 3, name: "Netflix Sub", type: "expense", value: "$15.99", icon: "home", tag: "Manual" },
  ]);

  const isEmpty = data.length === 0;
  const incomeCount = data.filter(i => i.type === 'income').length;
  const expenseCount = data.filter(i => i.type === 'expense').length;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
      <HeaderBar
        theme={theme}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn(theme)}>
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        title={<Text style={{ fontSize: 20, fontWeight: "800", color: theme.textPrimary }}>Recurring</Text>}
        rightContent={
          <TouchableOpacity onPress={() => router.push("/add-recurring")} style={styles.iconBtn(theme)}>
            <Plus size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 120, maxWidth: 500, alignSelf: 'center', width: '100%' }}>
        {/* SUMMARY SECTION */}
        <View style={{ flexDirection: 'row', gap: 14, paddingHorizontal: 20, paddingVertical: 24 }}>
          <SummaryCard theme={theme} label="Est. Income" value={isEmpty ? "$0.00" : "$3,000.00"} trend="+5.2%" />
          <SummaryCard theme={theme} label="Est. Bills" value={isEmpty ? "$0.00" : "$1,215.99"} trend="-2.1%" isLoss />
        </View>

        {/* LIST SECTION */}
        <View style={{ paddingHorizontal: 20 }}>
          {!isEmpty && (
            <>
              <SectionHeader 
                theme={theme} title="Income" variant="label" uppercase marginBottom={12}
                rightComponent={<Text style={{ fontSize: 11, fontWeight: "700", color: theme.textSecondary, opacity: 0.6 }}>{incomeCount} total</Text>}
              />
              {data.filter(i => i.type === 'income').map(item => <TransactionItem key={item.id} item={item} theme={theme} />)}

              <View style={{ height: 16 }} />

              <SectionHeader 
                theme={theme} title="Expenses" variant="label" uppercase marginBottom={12}
                rightComponent={<Text style={{ fontSize: 11, fontWeight: "700", color: theme.textSecondary, opacity: 0.6 }}>{expenseCount} total</Text>}
              />
              {data.filter(i => i.type === 'expense').map(item => <TransactionItem key={item.id} item={item} theme={theme} />)}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  iconBtn: (theme: AppTheme) => ({
    width: 32, height: 32, borderRadius: 10, borderWidth: 1, borderColor: `${theme.border}80`,
    backgroundColor: theme.surface, alignItems: "center" as const, justifyContent: "center" as const
  }),
};
