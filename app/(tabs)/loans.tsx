import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { 
  ChevronLeft, 
  Plus, 
  Landmark,
  Smartphone,
  Car,
  CircleUserRound
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import HeaderBar from "../../components/HeaderBar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/Card";
import type { AppTheme } from "../../constants/theme";

/* ================= SUB-COMPONENTS ================= */

const StatusBadge = ({ type, label, theme }: { type: 'danger' | 'success' | 'neutral', label: string, theme: AppTheme }) => {
  const getColors = () => {
    switch(type) {
      case 'danger': return { bg: `${theme.danger}15`, text: theme.danger };
      case 'success': return { bg: `${theme.brandPrimary}15`, text: theme.brandPrimary };
      default: return { bg: `${theme.textSecondary}15`, text: theme.textSecondary };
    }
  };

  const colors = getColors();
  
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>
        {label}
      </Text>
    </View>
  );
};

/* ================= MAIN COMPONENT ================= */

export default function LoanDashboardScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Bank Loans", "EMIs", "Personal"];
  
  const loans = [
    { id: 1, title: "Home Loan", progress: "12/60 Months Paid", amount: "45,000", status: "Due in 4 Days", statusType: "danger", icon: Landmark, iconBg: "#EEF2FF", iconColor: "#4F46E5" },
    { id: 2, title: "iPhone 15 Pro EMI", progress: "3/12 Months Paid", amount: "12,500", status: "Paid", statusType: "success", icon: Smartphone, iconBg: "#FAF5FF", iconColor: "#9333EA" },
    { id: 3, title: "Auto Loan", progress: "24/48 Months Paid", amount: "28,000", status: "Due in 15 Days", statusType: "neutral", icon: Car, iconBg: "#FFF7ED", iconColor: "#EA580C" },
    { id: 4, title: "Personal Loan", progress: "8/24 Months Paid", amount: "5,000", status: "Overdue", statusType: "danger", icon: CircleUserRound, iconBg: "#F1F5F9", iconColor: "#475569", type: "Personal" },
  ];

  const filteredLoans = loans.filter(loan => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Bank Loans") return loan.icon === Landmark;
    if (activeFilter === "EMIs") return loan.icon === Smartphone;
    if (activeFilter === "Personal") return loan.icon === CircleUserRound;
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.maxContainer}>
        <HeaderBar
          theme={theme}
          leftContent={
            <TouchableOpacity onPress={() => router.back()} style={[styles.headerBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
              <ChevronLeft size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          }
          title="Loans & EMIs"
          rightContent={
            <TouchableOpacity onPress={() => router.push('/add-loan' as any)} style={[styles.headerBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
              <Plus size={20} color={theme.textPrimary} />
            </TouchableOpacity>
          }
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* SUMMARY CARD */}
          <Card 
            theme={theme} 
            style={[styles.summaryCard, { backgroundColor: theme.brandNavy }]}
          >
            <CardHeader theme={theme}>
              <CardDescription theme={theme} style={styles.summaryLabel}>
                Total Outstanding
              </CardDescription>
              <CardTitle theme={theme} style={styles.summaryAmount}>
                NPR 1,250,000
              </CardTitle>
            </CardHeader>
            <CardContent theme={theme}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressPercent}>35% Repaid</Text>
                <Text style={styles.progressRemain}>NPR 675,000 remaining</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: "35%", backgroundColor: theme.brandPrimary }]} />
              </View>
            </CardContent>
          </Card>

          {/* FILTER BAR */}
          <View style={styles.filterWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {filters.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <TouchableOpacity 
                    key={filter} 
                    onPress={() => setActiveFilter(filter)}
                    style={[
                      styles.filterBtn, 
                      { 
                        backgroundColor: isActive ? theme.brandPrimary : theme.surface,
                        borderColor: isActive ? theme.brandPrimary : theme.border,
                      }
                    ]}
                  >
                    <Text style={[styles.filterText, { color: isActive ? "#FFF" : theme.textSecondary }]}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* LOAN LIST */}
          <View style={styles.loanList}>
            {filteredLoans.map((loan) => (
              <TouchableOpacity 
                key={loan.id} 
                onPress={() => router.push('/loan-detail' as any)}
              >
                <Card 
                  theme={theme} 
                  style={[styles.loanCard, { borderColor: `${theme.border}50` }]}
                >
                  <View style={styles.loanRow}>
                    <View style={[styles.iconBox, { backgroundColor: loan.iconBg }]}>
                      <loan.icon size={22} color={loan.iconColor} />
                    </View>
                    
                    <View style={styles.loanInfo}>
                      <Text style={[styles.loanTitle, { color: theme.textPrimary }]}>{loan.title}</Text>
                      <Text style={[styles.loanProgress, { color: theme.textSecondary }]}>{loan.progress}</Text>
                    </View>

                    <View style={styles.loanAmountContainer}>
                      <Text style={[styles.loanAmount, { color: theme.textPrimary }]}>
                        NPR {loan.amount}<Text style={[styles.moLabel, { color: theme.textSecondary }]}>/mo</Text>
                      </Text>
                      <StatusBadge theme={theme} type={loan.statusType as any} label={loan.status} />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* FLOATING ACTION BUTTON */}
        <TouchableOpacity 
          onPress={() => router.push('/add-loan' as any)}
          style={[styles.fab, { backgroundColor: theme.brandPrimary, boxShadow: `0 8px 20px ${theme.brandPrimary}40` }]}
        >
          <Plus size={28} color="#FFFFFF" strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  maxContainer: {
    flex: 1,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 150,
  },
  headerBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCard: {
    marginTop: 16,
    borderWidth: 0,
    elevation: 8,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  summaryAmount: {
    color: "#FFFFFF",
    fontSize: 32,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFF",
  },
  progressRemain: {
    fontSize: 11,
    opacity: 0.7,
    color: "#FFF",
  },
  progressBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  loanList: {
    gap: 14,
    marginTop: 8,
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  filterWrapper: {
    marginTop: 20,
    marginBottom: 10,
  },
  filterScroll: {
    paddingRight: 24,
    gap: 10,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  loanCard: {
    marginHorizontal: 0,
  },
  loanRow: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loanInfo: {
    flex: 1,
  },
  loanTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  loanProgress: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  loanAmountContainer: {
    alignItems: "flex-end",
  },
  loanAmount: {
    fontSize: 14,
    fontWeight: "800",
  },
  moLabel: {
    fontSize: 10,
    fontWeight: "400",
  },
  badge: {
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    zIndex: 20,
  },
});
