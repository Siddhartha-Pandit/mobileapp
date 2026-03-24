import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { PrimaryButton } from '../components/PrimaryButton';
import HeaderBar from '../components/HeaderBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Server, Database, TrendingUp, Gem, Activity } from 'lucide-react-native';

const AdminCronScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  
  // Mock admin check. If not admin, we could redirect back, but we just show it for demo since isAdmin=true in /more
  const isAdmin = true; 

  const [isSubmittingStock, setIsSubmittingStock] = useState(false);
  const [isSubmittingGold, setIsSubmittingGold] = useState(false);
  
  const [stockMessage, setStockMessage] = useState({ text: '', type: '' });
  const [goldMessage, setGoldMessage] = useState({ text: '', type: '' });

  const handlePingStock = () => {
    if (isSubmittingStock) return;
    setIsSubmittingStock(true);
    setStockMessage({ text: '', type: '' });
    
    // Simulate API call to trigger cron
    setTimeout(() => {
        setIsSubmittingStock(false);
        // Randomly simulating success or error for demo
        const isSuccess = Math.random() > 0.2; 
        if (isSuccess) {
            setStockMessage({ text: 'Global stock scrape job completed successfully.', type: 'success' });
        } else {
            setStockMessage({ text: 'Error executing stock scrape job. Please try again.', type: 'error' });
        }
    }, 1500);
  };

  const handlePingGold = () => {
    if (isSubmittingGold) return;
    setIsSubmittingGold(true);
    setGoldMessage({ text: '', type: '' });
    
    // Simulate API call to trigger cron
    setTimeout(() => {
        setIsSubmittingGold(false);
        // Randomly simulating success or error for demo
        const isSuccess = Math.random() > 0.2; 
        if (isSuccess) {
            setGoldMessage({ text: 'Global metals scrape job completed successfully.', type: 'success' });
        } else {
            setGoldMessage({ text: 'Error executing metals scrape job. Please try again.', type: 'error' });
        }
    }, 1500);
  };

  if (!isAdmin) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <HeaderBar theme={theme} title="Access Denied" showBack />
        <View style={styles.centerContainer}>
          <Text style={{ color: theme.textPrimary }}>You do not have permission to view this page.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <HeaderBar 
        theme={theme} 
        title="Admin Cron Jobs" 
        showBack 
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerContainer}>
            <View style={[styles.iconContainer, { backgroundColor: `${theme.brandPrimary}20` }]}>
               <Server size={32} color={theme.brandPrimary} />
            </View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Data Scraper Jobs</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Manually trigger background scraping jobs. Administrative access only.
            </Text>
          </View>

          {/* Stock Scrape Card */}
          <View style={[styles.jobCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <TrendingUp size={24} color="#10B981" />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Scrape Stock Data</Text>
            </View>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Fetch latest prices, volumes, and metrics for a specific stock symbol.
            </Text>
            
            <PrimaryButton 
              title={isSubmittingStock ? "Pinging..." : "Ping Stock Scraper"} 
              theme={theme} 
              onPress={handlePingStock} 
              fullWidth 
              disabled={isSubmittingStock} 
            />
            {stockMessage.text ? (
              <Text style={[styles.messageText, { color: stockMessage.type === 'success' ? '#10B981' : '#EF4444' }]}>
                {stockMessage.text}
              </Text>
            ) : null}
          </View>

          {/* Gold & Silver Scrape Card */}
          <View style={[styles.jobCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <Gem size={24} color="#F59E0B" />
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Scrape Gold & Silver Data</Text>
            </View>
            <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
              Fetch the freshest spot prices and market data for precious metals.
            </Text>
            
            <PrimaryButton 
              title={isSubmittingGold ? "Pinging..." : "Ping Metals Scraper"} 
              theme={theme} 
              onPress={handlePingGold} 
              fullWidth 
              disabled={isSubmittingGold} 
            />
            {goldMessage.text ? (
              <Text style={[styles.messageText, { color: goldMessage.type === 'success' ? '#10B981' : '#EF4444' }]}>
                {goldMessage.text}
              </Text>
            ) : null}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { 
    padding: 24,
    paddingBottom: 40,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%'
  },
  headerContainer: { 
    marginBottom: 32,
    alignItems: 'center'
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  title: { 
    fontSize: 22, 
    fontWeight: '800',
    marginBottom: 8
  },
  subtitle: { 
    fontSize: 14, 
    textAlign: 'center',
    lineHeight: 20
  },
  jobCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  cardDescription: {
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18
  },
  inputGroup: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 13, 
    fontWeight: '600', 
    marginBottom: 8 
  },
  input: { 
    width: '100%', 
    height: 52, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    fontSize: 15,
  },
  messageText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 8
  }
});

export default AdminCronScreen;
