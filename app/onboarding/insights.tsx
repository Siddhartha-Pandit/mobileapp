import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../hooks/useTheme';
import { ProgressDots } from '../../components/ProgressDots';
import { PrimaryButton } from '../../components/PrimaryButton';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const BAR_DATA = [50, 75, 35, 100, 65, 50];

export default function OnboardingInsightsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const animatedValues = useRef(BAR_DATA.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = BAR_DATA.map((_, index) => {
      return Animated.timing(animatedValues[index], {
        toValue: 1,
        duration: 600,
        delay: 300 + index * 50,
        useNativeDriver: false,
      });
    });
    Animated.stagger(50, animations).start();
  }, []);

  const isSmall = width < 360;
  const cardWidth = isSmall ? 240 : 280;
  const cardHeight = isSmall ? 280 : 320;
  const titleSize = isSmall ? 22 : 26;
  const textSize = isSmall ? 14 : 15;

  return (
    <LinearGradient colors={[theme.brandNavy, theme.background]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 40 }} />
          <ProgressDots activeIndex={2} theme={theme} />
          <TouchableOpacity onPress={() => router.replace('/login' as any)}>
            <Text style={[styles.skipButton, { color: theme.textSecondary }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroContainer}>
            <BlurView intensity={20} tint="dark" style={[styles.card, { width: cardWidth, height: cardHeight, borderColor: theme.textSecondary + '20' }]}>
                {/* Top Section */}
                <View style={styles.cardHeader}>
                    <View>
                        <View style={[styles.placeholderBar, { width: 40, marginBottom: 6, backgroundColor: theme.textSecondary + '30' }]} />
                        <View style={[styles.placeholderBar, { width: 80, height: 6, backgroundColor: theme.textSecondary + '40' }]} />
                    </View>
                    <View style={[styles.aiBadge, { backgroundColor: theme.brandPrimary + '30' }]}>
                        <Text style={[styles.aiBadgeText, { color: theme.brandPrimary }]}>AI</Text>
                    </View>
                </View>

                {/* Line Graph */}
                <View style={{ height: 96, marginBottom: 24 }}>
                    <Svg viewBox="0 0 200 80" style={{ width: '100%', height: '100%' }}>
                        <Defs>
                            <SvgLinearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <Stop offset="0%" stopColor={theme.brandPrimary} stopOpacity="1" />
                                <Stop offset="100%" stopColor={theme.brandPrimary} stopOpacity="0" />
                            </SvgLinearGradient>
                        </Defs>
                        <Path d="M0 60 Q 25 55, 50 40 T 100 30 T 150 45 T 200 10" fill="none" stroke={theme.brandPrimary} strokeWidth="3" strokeLinecap="round" />
                        <Path d="M0 60 Q 25 55, 50 40 T 100 30 T 150 45 T 200 10 V 80 H 0 Z" fill="url(#lineGrad)" opacity="0.15" />
                    </Svg>
                </View>

                {/* Bar Graph */}
                <View style={styles.barGraphContainer}>
                    {BAR_DATA.map((h, i) => (
                        <Animated.View
                            key={i}
                            style={[{
                                flex: 1,
                                height: animatedValues[i].interpolate({ inputRange: [0, 1], outputRange: ['0%', `${h}%`]}),
                                backgroundColor: i === 3 ? theme.brandPrimary : i === 1 ? theme.brandPrimary + '80' : theme.textSecondary + '20',
                            },
                            styles.bar
                        ]} />
                    ))}
                </View>

                {/* Floating AI Tip */}
                <View style={[styles.aiTip, { backgroundColor: theme.brandPrimary, shadowColor: theme.brandPrimary }]}>
                    <Text style={styles.aiTipText}>✨ AI TIP: Save $200 more</Text>
                </View>
            </BlurView>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { fontSize: titleSize, color: theme.textPrimary }]}>Smart Financial Insights</Text>
          <Text style={[styles.text, { fontSize: textSize, color: theme.textSecondary }]}>
            Get AI-powered recommendations, track lending and borrowing, manage loans, and make smarter financial decisions.
          </Text>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: theme.textSecondary + '20' }]}>
            <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.backButton, { color: theme.textSecondary }]}>Back</Text>
            </TouchableOpacity>
            <PrimaryButton title="Get Started" theme={theme} onPress={() => router.replace('/login' as any)} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 },
  skipButton: { fontWeight: '600', fontSize: 14 },
  heroContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { borderRadius: 20, padding: 20, borderWidth: 1, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  placeholderBar: { height: 4, borderRadius: 10 },
  aiBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  aiBadgeText: { fontSize: 14, fontWeight: '700' },
  barGraphContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6, height: 64 },
  bar: { borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  aiTip: { position: 'absolute', top: '50%', left: '50%', transform: [{translateX: -75}, {translateY: -10}], paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 10 } },
  aiTipText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  contentContainer: { textAlign: 'center', marginBottom: 24 },
  title: { fontWeight: '800', textAlign: 'center', marginBottom: 16 },
  text: { textAlign: 'center', maxWidth: 320, alignSelf: 'center', lineHeight: 22 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, paddingTop: 16, paddingBottom: 32 },
  backButton: { fontWeight: '600', fontSize: 14, padding: 8 },
});
