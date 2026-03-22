import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from '../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText } from 'lucide-react-native';

const TermsConditionsScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement."
    },
    {
      title: "2. User License",
      content: "Permission is granted to temporarily download one copy of the materials (information or software) on this app for personal, non-commercial transitory viewing only."
    },
    {
      title: "3. Account Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device."
    }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, {backgroundColor: theme.surface, borderColor: theme.border + '80'}]}>
                <ArrowLeft size={20} color={theme.textPrimary}/>
            </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Hero Icon & Title */}
            <View style={styles.heroContainer}>
                <View style={[styles.iconContainer, { backgroundColor: theme.brandPrimary + '15'}]}>
                    <FileText size={48} color={theme.brandPrimary} strokeWidth={1.5} />
                </View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Terms & Conditions</Text>
                <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>Last updated: February 2026</Text>
            </View>

            {/* Content Blocks */}
            <View style={styles.contentContainer}>
                {sections.map((section, index) => (
                    <View key={index} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{section.title}</Text>
                        <Text style={[styles.cardContent, { color: theme.textSecondary }]}>{section.content}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
        <View style={[styles.footer, {backgroundColor: theme.background}]}>
            <PrimaryButton
              title="I Accept These Terms"
              theme={theme}
              onPress={() => router.back()}
              fullWidth
            />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
        elevation: 2,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 120, // To make space for the sticky button
    },
    heroContainer: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 32,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 8,
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    lastUpdated: {
        fontSize: 14,
        fontWeight: '600',
    },
    contentContainer: {
        gap: 16,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 10,
    },
    cardContent: {
        fontSize: 14,
        lineHeight: 22,
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 40, // For safe area
        paddingTop: 10,
    }
});

export default TermsConditionsScreen;
