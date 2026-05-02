import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react-native";
import type { AppTheme } from "../constants/theme";
import { PrimaryButton } from "./PrimaryButton";

export type MessageType = "error" | "success" | "info" | "warning";

interface MessageModalProps {
  visible: boolean;
  type: MessageType;
  title: string;
  message: string;
  onClose: () => void;
  theme: AppTheme;
  buttonText?: string;
}

export const MessageModal = ({
  visible,
  type,
  title,
  message,
  onClose,
  theme,
  buttonText = "OK",
}: MessageModalProps) => {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircle size={48} color={theme.danger} />;
      case "success":
        return <CheckCircle2 size={48} color={theme.brandPrimary} />;
      case "warning":
        return <AlertTriangle size={48} color={theme.warning} />;
      case "info":
      default:
        return <Info size={48} color={theme.brandPrimary} />;
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case "error":
        return theme.danger;
      case "warning":
        return theme.warning;
      case "success":
      case "info":
      default:
        return theme.brandPrimary;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <View style={[styles.modalContainer, { backgroundColor: theme.surface }]}>
            <View style={styles.content}>
              <View style={[styles.iconContainer, { backgroundColor: `${getHeaderColor()}15` }]}>
                {getIcon()}
              </View>
              
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                {title}
              </Text>
              
              <Text style={[styles.message, { color: theme.textSecondary }]}>
                {message}
              </Text>

              <PrimaryButton
                title={buttonText}
                onPress={onClose}
                theme={theme}
                fullWidth
                style={{ marginTop: 24 }}
                backgroundColor={getHeaderColor()}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      }
    }),
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
});
