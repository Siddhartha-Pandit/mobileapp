import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from '../components/PrimaryButton';
import { StepProgress } from '../components/StepProgress';
import { SingleSelectOption } from '../components/SingleSelectOption';
import { SafeAreaView } from 'react-native-safe-area-context';

const CurrencySetupScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [currency, setCurrency] = useState('NPR');

  const handleNext = () => {
    console.log('Currency selected:', currency);
    // Move to next step: Create Account
    router.push('/create-account');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Step Progress Header */}
        <StepProgress
            theme={theme}
            step={1}
            totalSteps={4}
            title="Welcome to Dhukuti!"
            subtitle="Let's set up your account in a few simple steps"
        />

        {/* Currency Selection Card */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                Select Your Currency
            </Text>
            <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                This will be your default currency for transactions.
            </Text>

            <View style={styles.optionsContainer}>
                <SingleSelectOption
                    theme={theme}
                    label="NPR"
                    description="Nepalese Rupee"
                    value="NPR"
                    symbol="Rs"
                    selectedValue={currency}
                    onChange={setCurrency}
                />
                <SingleSelectOption
                    theme={theme}
                    label="USD"
                    description="United States Dollar"
                    value="USD"
                    symbol="$"
                    selectedValue={currency}
                    onChange={setCurrency}
                />
                <SingleSelectOption
                    theme={theme}
                    label="INR"
                    description="Indian Rupee"
                    value="INR"
                    symbol="₹"
                    selectedValue={currency}
                    onChange={setCurrency}
                />
                <SingleSelectOption
                    theme={theme}
                    label="EUR"
                    description="Euro"
                    value="EUR"
                    symbol="€"
                    selectedValue={currency}
                    onChange={setCurrency}
                />
            </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footer}>
            <PrimaryButton
                title="Continue"
                theme={theme}
                onPress={handleNext}
                fullWidth
            />
            <TouchableOpacity 
                onPress={() => router.replace('/(tabs)/home')} 
                style={styles.skipButton}
            >
                <Text style={[styles.skipText, { color: theme.textSecondary }]}>
                    Skip for now
                </Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { 
    padding: 24, 
    flexGrow: 1, 
    paddingBottom: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
      padding: 20,
      borderRadius: 18,
      borderWidth: 1,
      marginTop: 20,
      width: '100%',
      maxWidth: 500,
      alignSelf: 'center',
  },
  cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 6,
  },
  cardSubtitle: {
      fontSize: 13,
      marginBottom: 20,
  },
  optionsContainer: {
      gap: 12,
  },
  footer: {
      marginTop: 40,
      gap: 16,
      alignItems: 'center',
  },
  skipButton: {
      padding: 8,
  },
  skipText: {
      fontSize: 14,
      fontWeight: '600',
      textDecorationLine: 'underline',
  },
});

export default CurrencySetupScreen;
