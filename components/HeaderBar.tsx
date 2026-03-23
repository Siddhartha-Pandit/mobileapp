import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Info, X } from "lucide-react-native";
import type { AppTheme } from "../constants/theme";

interface HeaderBarProps {
  leftContent?: React.ReactNode;
  title?: string | React.ReactNode;
  rightContent?: React.ReactNode;
  theme: AppTheme;
  showBack?: boolean;
  /** Optional tooltip text shown when the info (i) button is pressed */
  pageInfo?: string;
}

const HeaderBar = ({
  leftContent,
  title,
  rightContent,
  theme,
  showBack = true,
  pageInfo,
}: HeaderBarProps) => {
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const renderLeft = () => {
    if (leftContent) return leftContent;
    if (showBack) {
      return (
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.iconBtn, { borderColor: `${theme.border}40`, backgroundColor: theme.surface }]}
        >
          <ChevronLeft size={22} color={theme.textPrimary} />
        </TouchableOpacity>
      );
    }
    return <View style={{ width: 44 }} />;
  };

  const renderRight = () => {
    if (rightContent) return rightContent;
    // Always show an Info icon — it shows the page description if provided,
    // or a generic "no info available" message otherwise.
    return (
      <TouchableOpacity
        style={[styles.iconBtn, { borderColor: `${theme.border}40`, backgroundColor: theme.surface }]}
        onPress={() => setShowTooltip(true)}
      >
        <Info size={20} color={theme.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.surface,
            borderBottomColor: `${theme.border}20`,
          },
        ]}
      >
        <View style={styles.maxContainer}>
          {/* Left */}
          <View style={styles.leftSection}>{renderLeft()}</View>

          {/* Title */}
          <View style={styles.titleContainer}>
            {typeof title === "string" ? (
              <Text style={[styles.titleText, { color: theme.textPrimary }]} numberOfLines={1}>
                {title}
              </Text>
            ) : (
              title
            )}
          </View>

          {/* Right */}
          <View style={styles.rightSection}>{renderRight()}</View>
        </View>
      </View>

      {/* Info Tooltip Modal */}
      <Modal
        visible={showTooltip}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTooltip(false)}
      >
        <Pressable style={styles.tooltipOverlay} onPress={() => setShowTooltip(false)}>
          <Pressable style={[styles.tooltipCard, { backgroundColor: theme.surface, borderColor: `${theme.border}30` }]}>
            <View style={styles.tooltipHeader}>
              <View style={[styles.tooltipIconBadge, { backgroundColor: `${theme.brandPrimary}15` }]}>
                <Info size={20} color={theme.brandPrimary} />
              </View>
              <Text style={[styles.tooltipTitle, { color: theme.textPrimary }]}>
                {typeof title === "string" ? title : "About This Page"}
              </Text>
              <TouchableOpacity onPress={() => setShowTooltip(false)}>
                <X size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.tooltipBody, { color: theme.textSecondary }]}>
              {pageInfo || "This page helps you manage your finances. Use the controls below to get started."}
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    zIndex: 50,
    borderBottomWidth: 1,
    boxShadow: "0px 4px 12px rgba(0,0,0,0.03)",
    elevation: 2,
    width: "100%",
  },
  maxContainer: {
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  leftSection: {
    minWidth: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontWeight: "900",
    fontSize: 20,
    letterSpacing: -0.5,
  },
  rightSection: {
    minWidth: 44,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  // Tooltip styles
  tooltipOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  tooltipCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 28,
    borderWidth: 1,
    padding: 28,
    gap: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },
  tooltipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tooltipIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tooltipTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  tooltipBody: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "500",
  },
});

export default HeaderBar;
