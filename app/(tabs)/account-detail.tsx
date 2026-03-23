import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Modal, 
  ActivityIndicator,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  ChevronLeft, 
  Trash2, 
  Plus, 
  ArrowLeftRight, 
  Wallet, 
  MoreVertical, 
  Edit,
  AlertTriangle
} from "lucide-react-native";
import { Card, CardContent } from "../../components/Card";
import HeaderBar from "../../components/HeaderBar";
import { useTheme } from "../../hooks/useTheme";
import type { AppTheme } from "../../constants/theme";
import { GrowthLineChart } from "../../components/charts/GrowthLineChart";

export default function AccountDetailPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  const account = {
    name: "Personal Savings",
    type: "Bank Account",
    balance: 45680,
    color: "#1152d4",
    includeInTotal: true,
    notes: "Emergency fund & long term savings account.",
  };

  const handleDelete = () => {
    setMenuOpen(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    setActionLoading('Deleting Account...');
    setTimeout(() => {
      setActionLoading(null);
      router.back();
    }, 2000);
  };

  // Chart Data format for GrowthLineChart
  const chartData = [
    { value: 350 }, { value: 380 }, { value: 360 },
    { value: 420 }, { value: 400 }, { value: 456 }, { value: 456 }
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ================= HEADER ================= */}
      <HeaderBar
        theme={theme}
        title={<Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Account</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <View style={{ position: "relative" }}>
            <TouchableOpacity 
              onPress={() => setMenuOpen(!menuOpen)}
              style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}
            >
              <MoreVertical size={20} color={theme.textPrimary} />
            </TouchableOpacity>

            {menuOpen && (
              <View style={[styles.dropdown, { backgroundColor: theme.surface, borderColor: `${theme.border}80` }]}>
                <TouchableOpacity
                  style={[styles.menuItem, { borderBottomColor: `${theme.border}40`, borderBottomWidth: 1 }]}
                  onPress={() => { setMenuOpen(false); /* router.push('/edit-account') */ }}
                >
                  <Edit size={16} color={theme.textPrimary} style={{ marginRight: 12 }} />
                  <Text style={[styles.menuText, { color: theme.textPrimary }]}>Edit Account</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleDelete}
                >
                  <Trash2 size={16} color="#ef4444" style={{ marginRight: 12 }} />
                  <Text style={[styles.menuText, { color: "#ef4444" }]}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Subtitle */}
        <View style={styles.subtitleBox}>
          <Text style={[styles.subtitleText, { color: theme.textSecondary }]}>
            {account.name} • {account.type}
          </Text>
        </View>

        {/* ================= BALANCE CARD ================= */}
        <View style={styles.sectionWrap}>
          <Card theme={theme}>
            <CardContent theme={theme} style={styles.cardPadding}>
              <Text style={[styles.labelStyle, { color: theme.textSecondary }]}>CURRENT BALANCE</Text>
              <Text style={[styles.balanceStyle, { color: theme.textPrimary }]}>
                ₨ {account.balance.toLocaleString()}
              </Text>
            </CardContent>
          </Card>
        </View>

        {/* ================= QUICK ACTIONS ================= */}
        <View style={styles.actionContainer}>
          <ActionButton
            theme={theme}
            icon={<Plus size={20} />}
            label="Add Money"
            onPress={() => router.push("/add-money" as any)}
          />
          <ActionButton
            theme={theme}
            icon={<Wallet size={20} />}
            label="Expense"
            onPress={() => router.push("/add-expense" as any)}
          />
          <ActionButton
            theme={theme}
            icon={<ArrowLeftRight size={20} />}
            label="Transfer"
            onPress={() => router.push("/transfer" as any)}
          />
        </View>

        {/* ================= TREND (Custom Mock Chart) ================= */}
        <View style={styles.sectionWrap}>
          <Card theme={theme}>
            <CardContent theme={theme} style={styles.cardPadding}>
              <Text style={[styles.labelStyle, { color: theme.textSecondary }]}>BALANCE TREND</Text>
              <View style={styles.chartArea}>
                <GrowthLineChart
                  theme={theme}
                  data={chartData}
                  color={account.color}
                />
              </View>
            </CardContent>
          </Card>
        </View>

        {/* ================= DETAILS ================= */}
        <View style={styles.sectionWrap}>
          <Card theme={theme}>
            <CardContent theme={theme} style={styles.cardPadding}>
              <Text style={[styles.labelStyle, { color: theme.textSecondary }]}>STATISTICS & INFO</Text>

              <DetailRow theme={theme} label="Account Name" value={account.name} />
              <DetailRow theme={theme} label="Account Type" value={account.type} />

              <View style={styles.rowStyle}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Theme Color</Text>
                <View style={styles.colorIndicatorBox}>
                  <View style={[styles.colorCircle, { backgroundColor: account.color }]} />
                  <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{account.color}</Text>
                </View>
              </View>

              <DetailRow theme={theme} label="Included in Total" value={account.includeInTotal ? "Yes" : "No"} />

              <View style={[styles.rowStyle, { flexDirection: "column", alignItems: "flex-start", gap: 8 }]}>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Notes</Text>
                <Text style={[styles.detailValue, { color: theme.textPrimary, fontWeight: "500", lineHeight: 22 }]}>
                  {account.notes}
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>

      {/* ACTION LOADING MODAL */}
      <Modal visible={!!actionLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.loadingBox, { backgroundColor: theme.surface }]}>
            <ActivityIndicator size="large" color={theme.brandPrimary} />
            <Text style={[styles.loadingText, { color: theme.textPrimary }]}>{actionLoading}</Text>
          </View>
        </View>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal visible={showDeleteConfirm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.confirmBox, { backgroundColor: theme.surface }]}>
            <View style={[styles.alertIconBox, { backgroundColor: '#EF444415' }]}>
              <AlertTriangle size={32} color="#EF4444" />
            </View>
            <Text style={[styles.confirmTitle, { color: theme.textPrimary }]}>Delete Account?</Text>
            <Text style={[styles.confirmSubtitle, { color: theme.textSecondary }]}>
              This will permanently remove this account and all associated transactions. This action cannot be undone.
            </Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity 
                onPress={() => setShowDeleteConfirm(false)}
                style={[styles.cancelBtn, { borderColor: theme.border }]}
              >
                <Text style={{ color: theme.textSecondary, fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={confirmDelete}
                style={[styles.deleteBtn, { backgroundColor: '#EF4444' }]}
              >
                <Text style={{ color: '#FFF', fontWeight: '800' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const ActionButton = ({ theme, icon, label, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={[styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}>
    <View style={[styles.actionIconBox, { backgroundColor: `${theme.brandPrimary}15` }]}>
      {React.cloneElement(icon, { color: theme.brandPrimary })}
    </View>
    <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>{label}</Text>
  </TouchableOpacity>
);

const DetailRow = ({ theme, label, value }: any) => (
  <View style={styles.rowStyle}>
    <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{value}</Text>
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
  subtitleBox: { paddingHorizontal: 24, paddingBottom: 16 },
  subtitleText: { fontSize: 13, fontWeight: "600" },
  scrollContent: { paddingBottom: 100, maxWidth: 500, alignSelf: 'center', width: '100%' },
  sectionWrap: { paddingHorizontal: 24, marginBottom: 24 },
  cardPadding: { padding: 24 },
  labelStyle: { fontSize: 11, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase" },
  balanceStyle: { fontSize: 34, fontWeight: "900", marginTop: 12 },
  
  actionContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 24, marginBottom: 24, gap: 12 },
  actionBtn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    elevation: 3,
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  },
  actionIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  actionLabel: { fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.5 },

  dropdown: {
    position: "absolute",
    right: 0,
    top: 54,
    width: 200,
    borderRadius: 20,
    borderWidth: 1,
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    elevation: 5,
    zIndex: 100,
  },
  menuItem: { padding: 16, flexDirection: 'row', alignItems: 'center' },
  menuText: { fontSize: 14, fontWeight: "700" },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  loadingBox: { padding: 32, borderRadius: 24, alignItems: 'center', gap: 16, width: '80%', maxWidth: 300 },
  loadingText: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  confirmBox: { padding: 32, borderRadius: 32, alignItems: 'center', width: '100%', maxWidth: 400 },
  alertIconBox: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  confirmTitle: { fontSize: 20, fontWeight: '900', marginBottom: 12 },
  confirmSubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32, opacity: 0.8 },
  confirmActions: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelBtn: { flex: 1, height: 54, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  deleteBtn: { flex: 1, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },

  chartArea: { height: 160, marginTop: 24 },
  rowStyle: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 20 },
  detailLabel: { fontSize: 13, fontWeight: "600" },
  detailValue: { fontSize: 15, fontWeight: "700" },
  colorIndicatorBox: { flexDirection: "row", alignItems: "center", gap: 10 },
  colorCircle: { width: 14, height: 14, borderRadius: 7 },
});
