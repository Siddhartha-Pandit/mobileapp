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
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react-native';

const PrivacyPolicyScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const policies = [
    {
      label: "Data Collection",
      desc: "We collect information you provide directly to us when you create an account, such as your name and email address."
    },
    {
      label: "Information Usage",
      desc: "Your data is used to provide, maintain, and improve our services, and to protect the security of our users."
    },
    {
      label: "Cookies",
      desc: "We use cookies to personalize content and analyze our traffic to provide a better user experience."
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
            {/* Icon & Title */}
            <View style={styles.heroContainer}>
                <View style={[styles.iconContainer, { backgroundColor: theme.brandPrimary + '15'}]}>
                    <ShieldCheck size={48} color={theme.brandPrimary} strokeWidth={1.5} />
                </View>
                <Text style={[styles.title, { color: theme.textPrimary }]}>Privacy Policy</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Your privacy is important to us. Learn how we handle your data.
                </Text>
            </View>

            {/* Policy List */}
            <View style={{ marginBottom: 40, gap: 20 }}>
                {policies.map((item, index) => (
                    <View key={index} style={styles.policyItem}>
                        <CheckCircle2 size={20} color={theme.brandPrimary} style={{marginTop: 3}}/>
                        <View style={{flex: 1}}>
                            <Text style={[styles.policyLabel, {color: theme.textPrimary}]}>{item.label}</Text>
                            <Text style={[styles.policyDesc, {color: theme.textSecondary}]}>{item.desc}</Text>
                        </View>
                    </View>
                ))}
            </View>

             {/* Bottom Card */}
            <View style={[styles.bottomCard, { backgroundColor: theme.brandPrimary + '08', borderColor: theme.brandPrimary + '40'}]}>
                <Text style={[styles.bottomCardText, {color: theme.textSecondary}]}>
                    By continuing to use our service, you acknowledge that you have read and understood this Privacy Policy.
                </Text>
            </View>

        </ScrollView>
        <View style={[styles.footer, {backgroundColor: theme.background}]}>
            <PrimaryButton
              title="Got It"
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
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        paddingHorizontal: 20,
        textAlign: 'center',
        lineHeight: 20
    },
    policyItem: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'flex-start'
    },
    policyLabel: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    policyDesc: {
        fontSize: 14,
        lineHeight: 20,
    },
    bottomCard: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginBottom: 20,
    },
    bottomCardText: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
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

export default PrivacyPolicyScreen;
