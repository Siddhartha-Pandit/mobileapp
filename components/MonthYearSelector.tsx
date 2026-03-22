import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface Props {
  variant?: "short" | "long";
  onDateChange?: (month: string, year: number) => void;
}

export const MonthYearSelector = ({
  variant = "long",
  onDateChange,
}: Props) => {
  const { theme } = useTheme(); // Use the theme hook
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("February");
  const [selectedYear, setSelectedYear] = useState(2026);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const years = [2024, 2025, 2026, 2027];

  const handleApply = () => {
    setOpen(false);
    if (onDateChange) {
      onDateChange(selectedMonth, selectedYear);
    }
  };

  const displayLabel = `${selectedMonth} ${selectedYear}`;

  return (
    <View>
      {/* Selector Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
        style={[
          styles.button,
          {
            paddingVertical: variant === "short" ? 6 : 8,
            paddingHorizontal: variant === "short" ? 8 : 16,
            backgroundColor: theme.surface,
            borderColor: `${theme.border}80`,
            borderWidth: 1,
          },
          open && styles.buttonShadow
        ]}
      >
        <Calendar
          size={variant === "short" ? 18 : 16}
          color={theme.brandPrimary}
        />

        {variant === "long" && (
          <Text style={[styles.buttonText, { color: theme.textPrimary }]}>
            {displayLabel}
          </Text>
        )}

        <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
          <ChevronDown
            size={14}
            color={theme.textPrimary}
            opacity={0.6}
          />
        </View>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.dropdownOptions,
                {
                  backgroundColor: theme.surface,
                  borderColor: `${theme.border}80`,
                  borderWidth: 1,
                }
              ]}
            >
              {/* Months */}
              <View style={[styles.monthsContainer, { borderRightColor: `${theme.border}50` }]}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                  MONTH
                </Text>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                >
                  {months.map((m) => {
                    const isSelected = selectedMonth === m;
                    return (
                      <TouchableOpacity
                        key={m}
                        onPress={() => setSelectedMonth(m)}
                        style={[
                          styles.optionItem,
                          {
                            backgroundColor: isSelected ? `${theme.brandPrimary}15` : 'transparent',
                          }
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            {
                              fontWeight: isSelected ? '800' : '500',
                              color: isSelected ? theme.brandPrimary : theme.textPrimary,
                            }
                          ]}
                        >
                          {m}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Years */}
              <View style={[styles.yearsContainer, { backgroundColor: `${theme.background}50` }]}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
                  YEAR
                </Text>

                <View style={styles.yearsList}>
                  {years.map((y) => {
                    const isSelected = selectedYear === y;
                    return (
                      <TouchableOpacity
                        key={y}
                        onPress={() => setSelectedYear(y)}
                        style={[
                          styles.optionItem,
                          {
                            backgroundColor: isSelected ? `${theme.brandPrimary}15` : 'transparent',
                          }
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            {
                              fontWeight: isSelected ? '800' : '500',
                              color: isSelected ? theme.brandPrimary : theme.textPrimary,
                            }
                          ]}
                        >
                          {y}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Apply Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleApply}
                  style={[
                    styles.applyButton,
                    {
                      backgroundColor: theme.brandPrimary,
                      shadowColor: theme.brandPrimary,
                    }
                  ]}
                >
                  <Text style={styles.applyButtonText}>APPLY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownOptions: {
    flexDirection: 'row',
    width: 320,
    height: 380,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 15,
  },
  monthsContainer: {
    flex: 1.2,
    padding: 12,
    borderRightWidth: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  yearsContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingBottom: 8,
    letterSpacing: 1,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 2,
  },
  optionText: {
    fontSize: 13,
  },
  yearsList: {
    flex: 1,
  },
  applyButton: {
    width: '100%',
    marginTop: 16,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
});
