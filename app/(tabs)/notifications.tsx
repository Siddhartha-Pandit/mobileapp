import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from "react-native";
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeft,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Bell,
  BellOff,
  RefreshCw,
  Settings,
  Trash2
} from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import HeaderBar from "../../components/HeaderBar";

// Notification Item Inline Component
const NotificationItem = ({ theme, icon, title, description, time, unread, accentColor, onDelete }: any) => {
  const renderRightActions = (progress: any, dragX: any) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity onPress={onDelete} activeOpacity={0.6}>
        <View style={[styles.deleteAction, { backgroundColor: '#EF4444' }]}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Trash2 size={24} color="#FFF" />
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      leftThreshold={30}
      rightThreshold={40}
    >
      <View style={[styles.notifItem, { backgroundColor: unread ? `${accentColor}10` : theme.surface }]}>
        <View style={styles.notifContent}>
          <View style={[styles.iconBox, { backgroundColor: theme.background }]}>
            {icon}
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.notifTitle, { color: theme.textPrimary }]}>{title}</Text>
            <Text style={[styles.notifDesc, { color: theme.textSecondary }]}>{description}</Text>
            <Text style={[styles.notifTime, { color: theme.textSecondary }]}>{time}</Text>
          </View>
        </View>
        {unread && <View style={[styles.unreadDot, { backgroundColor: accentColor }]} />}
      </View>
    </Swipeable>
  );
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Transactions", "Investments", "Reminders"];

  const initialData = [
    {
      title: "Today",
      data: [
        {
          id: 1,
          icon: <ArrowDownLeft size={18} color="#10B981" />,
          title: "Salary Deposit",
          description: "Your monthly salary of ₨ 75,000 has been credited.",
          time: "10:24 AM",
          unread: true,
          accentColor: "#10B981",
        },
        {
          id: 2,
          icon: <ArrowUpRight size={18} color="#EF4444" />,
          title: "Uber Payment",
          description: "Payment of ₨ 1,250 processed successfully.",
          time: "08:15 AM",
          unread: true,
          accentColor: "#EF4444",
        },
      ],
    },
    {
      title: "Yesterday",
      data: [
        {
          id: 3,
          icon: <TrendingUp size={18} color="#8B5CF6" />,
          title: "Portfolio Growth",
          description: "Your tech portfolio is up 2.4% today.",
          time: "04:30 PM",
          accentColor: "#8B5CF6",
        },
        {
          id: 4,
          icon: <Bell size={18} color={theme.brandPrimary} />,
          title: "Upcoming Bill",
          description: "Internet subscription is due tomorrow.",
          time: "11:00 AM",
        },
      ],
    },
  ];

  const [notificationSections, setNotificationSections] = useState(initialData);

  const handleDelete = (id: number) => {
    setNotificationSections((prev) =>
      prev.map((section) => ({
        ...section,
        data: section.data.filter((item) => item.id !== id),
      }))
    );
  };

  const markAllRead = () => {
    setNotificationSections((prev) =>
      prev.map((section) => ({
        ...section,
        data: section.data.map((item) => ({ ...item, unread: false })),
      }))
    );
  };

  const hasNotifications = notificationSections.some((section) => section.data.length > 0);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* ================= HEADER BAR ================= */}
      <HeaderBar
        theme={theme}
        title={<Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Notifications</Text>}
        leftContent={
          <TouchableOpacity onPress={() => router.back()} style={[styles.iconBtn, { borderColor: `${theme.border}80`, backgroundColor: theme.surface }]}>
            <ChevronLeft size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        rightContent={
          <TouchableOpacity onPress={markAllRead}>
            <Text style={[styles.markReadText, { color: theme.brandPrimary }]}>Mark all read</Text>
          </TouchableOpacity>
        }
      />

      {/* ================= TABS ================= */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.tabChip,
                  { backgroundColor: active ? theme.brandPrimary : theme.surface }
                ]}
              >
                <Text style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: active ? "#fff" : theme.textSecondary
                }}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {hasNotifications ? (
          notificationSections.map((section) =>
            section.data.length > 0 ? (
              <View key={section.title} style={{ marginBottom: 16 }}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                  {section.title}
                </Text>
                <View style={styles.listWrap}>
                  {section.data.map((item) => (
                    <NotificationItem
                      key={item.id}
                      theme={theme}
                      {...item}
                      onDelete={() => handleDelete(item.id)}
                    />
                  ))}
                </View>
              </View>
            ) : null
          )
        ) : (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconBox, { backgroundColor: `${theme.brandPrimary}15` }]}>
              <BellOff size={40} color={theme.brandPrimary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No notifications</Text>
            <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
              You're all caught up! We'll notify you here when there's activity.
            </Text>
            <TouchableOpacity
              onPress={() => setNotificationSections(initialData)}
              style={[styles.refreshBtn, { backgroundColor: theme.brandPrimary }]}
            >
              <RefreshCw size={16} color="#fff" />
              <Text style={styles.refreshBtnText}>Refresh Screen</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingsBtn}>
              <Settings size={16} color={theme.brandPrimary} />
              <Text style={[styles.settingsBtnText, { color: theme.brandPrimary }]}>Manage preferences</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
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
  markReadText: { fontWeight: "700", fontSize: 13 },
  tabsWrapper: { paddingVertical: 8, paddingHorizontal: 0 },
  tabsScroll: { paddingHorizontal: 24, paddingBottom: 16, gap: 10 },
  tabChip: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: { padding: 24, paddingBottom: 120, maxWidth: 500, alignSelf: 'center', width: '100%' },
  sectionTitle: {
    paddingVertical: 8,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
    zIndex: 10, // Ensure header is above swipeable items
  },
  listWrap: { gap: 12 },
  notifItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
  },
  notifContent: { flexDirection: "row", gap: 16, flex: 1 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: { flex: 1 },
  notifTitle: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  notifDesc: { fontSize: 13, lineHeight: 20, marginBottom: 8 },
  notifTime: { fontSize: 11, fontWeight: "600", opacity: 0.7 },
  deleteAction: {
    width: 80,
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  emptyState: { alignItems: "center", justifyContent: "center", paddingTop: 80, paddingHorizontal: 20 },
  emptyIconBox: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  emptyTitle: { fontSize: 20, fontWeight: "800", marginBottom: 8 },
  emptyDesc: { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 32 },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    marginBottom: 20,
    boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
    elevation: 8,
  },
  refreshBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  settingsBtn: { flexDirection: "row", alignItems: "center", gap: 8, padding: 8 },
  settingsBtnText: { fontWeight: "700", fontSize: 14 },
});
