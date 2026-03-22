import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Modal, TextInput, ScrollView, StyleSheet } from "react-native";
import type { AppTheme } from "../constants/theme";
import { Check, Plus, X } from "lucide-react-native";

interface Props {
  theme: AppTheme;
  colors: string[];
  selected: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({
  theme,
  colors,
  selected,
  onChange,
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [customColor, setCustomColor] = useState("#ff0000");
  const [colorList, setColorList] = useState<string[]>(colors);

  useEffect(() => {
    setColorList(colors);
  }, [colors]);

  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    // Default to white if invalid
    if (cleanHex.length !== 6 && cleanHex.length !== 3) {
        return { r: 255, g: 255, b: 255 };
    }
    
    let validHex = cleanHex;
    if (cleanHex.length === 3) {
      validHex = cleanHex.split('').map(char => char + char).join('');
    }

    const bigint = parseInt(validHex, 16);
    if (isNaN(bigint)) return { r: 255, g: 255, b: 255 };

    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const hexToHsl = (hex: string) => {
    let { r, g, b } = hexToRgb(hex);
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgb = hexToRgb(customColor);
  const hsl = hexToHsl(customColor);

  const applyCustomColor = () => {
    const formattedHex = customColor.startsWith('#') ? customColor : `#${customColor}`;
    
    // validate if its a valid hex code
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexPattern.test(formattedHex)) {
      alert("Please enter a valid HEX color code");
      return;
    }

    if (!colorList.includes(formattedHex)) {
      setColorList((prev) => [...prev, formattedHex]);
    }

    onChange(formattedHex);
    setShowModal(false);
  };

  return (
    <View>
      {/* Color List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {colorList.map((color) => {
          const isSelected = selected === color;

          return (
            <Pressable
              key={color}
              onPress={() => onChange(color)}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                isSelected && { 
                  borderWidth: 4, 
                  borderColor: `${color}40` // Using low opacity of the same color for border
                }
              ]}
            >
              {isSelected && <Check size={16} color="#fff" />}
            </Pressable>
          );
        })}

        {/* Add Color Button */}
        <Pressable
          onPress={() => setShowModal(true)}
          style={[
            styles.colorButton,
            { 
              borderWidth: 2, 
              borderStyle: "dashed", 
              borderColor: theme.border,
              backgroundColor: "transparent"
            }
          ]}
        >
          <Plus size={18} color={theme.textPrimary} />
        </Pressable>
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                Custom Color
              </Text>
              <Pressable onPress={() => setShowModal(false)} hitSlop={10}>
                <X size={20} color={theme.textPrimary} />
              </Pressable>
            </View>

            {/* Color Preview Block */}
            <View 
              style={[
                styles.colorPreview, 
                { backgroundColor: customColor.startsWith('#') ? customColor : `#${customColor}` }
              ]} 
            />

            {/* HEX Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>HEX</Text>
              <TextInput
                value={customColor}
                onChangeText={setCustomColor}
                style={[
                  styles.textInput, 
                  { 
                    backgroundColor: theme.background,
                    color: theme.textPrimary,
                    borderColor: theme.border
                  }
                ]}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={7}
              />
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoCol}>
                 <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>RGB</Text>
                 <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                   {rgb.r}, {rgb.g}, {rgb.b}
                 </Text>
              </View>
              <View style={styles.infoCol}>
                 <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>HSL</Text>
                 <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                   {hsl.h}, {hsl.s}%, {hsl.l}%
                 </Text>
              </View>
            </View>

            {/* Apply */}
            <Pressable
              onPress={applyCustomColor}
              style={[
                styles.applyButton,
                { backgroundColor: customColor.startsWith('#') ? customColor : `#${customColor}` }
              ]}
            >
              <Text style={styles.applyButtonText}>Apply Color</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    gap: 12,
    paddingBottom: 4,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: "85%",
    maxWidth: 360,
    padding: 24,
    borderRadius: 16,
    boxShadow: '0px 10px 20px rgba(0,0,0,0.2)',
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  colorPreview: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: "monospace",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "monospace",
  },
  applyButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
