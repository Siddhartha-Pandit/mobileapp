import * as React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView
} from "react-native";
import { X, Search, Palette } from "lucide-react-native";
import * as LucideIcons from "lucide-react-native";
import type { AppTheme } from "../constants/theme";
import { ColorPicker } from "./ColorPicker";

// Extract all valid icon components exported from lucide-react-native
const allIcons = Object.entries(LucideIcons)
  .filter(([key, value]) => {
    // Basic filter: must start with Uppercase, must be function/object (React component)
    return /^[A-Z]/.test(key) && (typeof value === "function" || typeof value === "object");
  })
  .map(([key, value]) => ({
    name: key,
    Component: value as any, // This is the actual LucideIcon component
  }));

interface IconModalProps {
  theme: AppTheme;
  onClose: () => void;
  onSelect: (icon: any) => void;
  selectedIcon: any;
  activeColor: string;
  onColorSelect?: (color: string) => void;
}

export const IconModal = ({
  theme,
  onClose,
  onSelect,
  selectedIcon,
  activeColor,
  onColorSelect,
}: IconModalProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredIcons = React.useMemo(() => {
    if (!searchQuery.trim()) return allIcons;
    return allIcons.filter((icon) =>
      icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // We need to compare selectedIcon object. Since components might be the same, 
  // or they might just share the same export name.
  const isIconSelected = (IconComp: any) => {
    if (selectedIcon === IconComp) return true;
    if (selectedIcon && selectedIcon.displayName && IconComp.displayName) {
      return selectedIcon.displayName === IconComp.displayName;
    }
    return false;
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose} // Closes modal when tapping the dark overlay
      >
        <TouchableWithoutFeedback>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            {/* Decorative Drag Handle */}
            <View style={[styles.dragHandle, { backgroundColor: theme.border }]} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                Select Icon
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeButton, { backgroundColor: theme.background }]}
              >
                <X size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Color Picker Section */}
            {onColorSelect && (
              <View style={styles.colorSection}>
                <View style={styles.sectionHeader}>
                  <Palette size={16} color={theme.textSecondary} />
                  <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Theme Color</Text>
                </View>
                <ColorPicker
                  theme={theme}
                  colors={[
                    theme.brandPrimary,
                    '#1E293B',
                    '#3B82F6',
                    '#F97316',
                    '#8B5CF6',
                    '#EF4444',
                    '#14B8A6',
                  ]}
                  selected={activeColor}
                  onChange={onColorSelect}
                />
              </View>
            )}

            {/* Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Search size={18} color={theme.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, { color: theme.textPrimary }]}
                placeholder="Search icons..."
                placeholderTextColor={theme.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <X size={16} color={theme.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Icon Grid (Wrapped in KeyboardAvoidingView to push up when searching) */}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={styles.keyboardView}
            >
              <FlatList
                data={filteredIcons}
                keyExtractor={(item) => item.name}
                numColumns={4}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                keyboardShouldPersistTaps="handled"
                initialNumToRender={40}
                maxToRenderPerBatch={40}
                windowSize={5}
                renderItem={({ item }) => {
                  const IconComp = item.Component;
                  const isSelected = isIconSelected(IconComp);

                  return (
                    <TouchableOpacity
                      onPress={() => onSelect(item)}
                      style={[
                        styles.iconOption,
                        {
                          borderColor: isSelected ? activeColor : `${theme.border}60`,
                          backgroundColor: isSelected ? `${activeColor}15` : theme.background,
                          borderWidth: isSelected ? 2.5 : 1,
                        },
                      ]}
                    >
                      <IconComp
                        size={28}
                        color={isSelected ? activeColor : theme.textSecondary}
                        strokeWidth={isSelected ? 3 : 2}
                      />
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={() => (
                  <View style={styles.emptyContainer}>
                    <Text style={{ color: theme.textSecondary }}>No icons found for "{searchQuery}"</Text>
                  </View>
                )}
              />
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    width: "100%",
    maxHeight: "90%",
    minHeight: "60%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    boxShadow: '0px -10px 20px rgba(0,0,0,0.15)',
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
    opacity: 0.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  } as any,
  keyboardView: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconOption: {
    width: "22%", // Accounts for space-between in a 4 item row
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  colorSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
