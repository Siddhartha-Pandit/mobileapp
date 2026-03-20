import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import type { AppTheme } from "../constants/theme";

interface HeaderBarProps {
  leftContent?: React.ReactNode;
  title?: React.ReactNode;
  rightContent?: React.ReactNode;
  theme: AppTheme;
}

const HeaderBar = ({ leftContent, title, rightContent, theme }: HeaderBarProps) => {
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: Platform.select({
            ios: `${theme.surface}e6`, // fallback for blur: 90% opacity (hex 'e6')
            default: theme.surface,
          }),
          borderBottomColor: `${theme.border}20`,
        },
      ]}
    >
      {/* Left section (hamburger/back) */}
      {leftContent && (
        <View style={styles.leftSection}>
          {leftContent}
        </View>
      )}

      {/* Title */}
      <View style={styles.titleContainer}>
        {typeof title === "string" ? (
          <Text
            style={[styles.titleText, { color: theme.textPrimary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        ) : (
          title
        )}
      </View>

      {/* Right section */}
      {rightContent && (
        <View style={styles.rightSection}>
          {rightContent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 50,
    borderBottomWidth: 1,
    // Add shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  leftSection: {
    minWidth: 36,
    minHeight: 36,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
  },
  titleText: {
    fontWeight: "800",
    fontSize: 22,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 36,
    justifyContent: "center",
  },
});

export default HeaderBar;
