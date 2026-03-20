import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { db, initializeDb } from '../../src/db';
import { users } from '../../src/db/schema';
import { useSyncStore } from '../../src/store/useSyncStore';
import { Wifi, WifiOff, Save, CloudLightning } from 'lucide-react-native';
import { BarChart } from 'react-native-gifted-charts';

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userList, setUserList] = useState<{ id: number; name: string; email: string; synced: boolean | null }[]>([]);
  const [loading, setLoading] = useState(true);

  const isOnline = useSyncStore((state: any) => state.isOnline);
  const syncPending = useSyncStore((state: any) => state.syncPending);
  const syncData = useSyncStore((state: any) => state.syncData);

  useEffect(() => {
    // 1. Initialize SQLite tables if they do not exist
    initializeDb();
    
    // 2. Fetch data from SQLite
    fetchLocalUsers();
  }, []);

  const fetchLocalUsers = async () => {
    try {
      setLoading(true);
      const data = await db.select().from(users);
      setUserList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async () => {
    if (!name || !email) return;

    try {
      // Offline-First Insert: Save deeply to local SQLite first
      await db.insert(users).values({
        name,
        email,
        synced: false
      });
      
      setName('');
      setEmail('');
      
      // Refresh local list
      await fetchLocalUsers();
      
      // If online, immediately trigger the sync queue
      if (isOnline) {
        syncData();
      }
    } catch (error) {
      console.error('Insert Error:', error);
    }
  };

  // Convert SQLite records into Gifted Charts format
  const chartData = userList.map((u, i) => ({
    value: Math.floor(Math.random() * 50) + 10, // Mock metric based on user length
    label: u.name.substring(0, 3),
    frontColor: u.synced ? '#4ade80' : '#f87171' // Green if synced, Red offline
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* HEADER WITH ICONS */}
      <View style={styles.header}>
        <Text style={styles.title}>Enterprise Sync Repo</Text>
        <View style={styles.networkBadge}>
          {isOnline ? (
            <Wifi color="#4ade80" size={24} />
          ) : (
            <WifiOff color="#f87171" size={24} />
          )}
          <Text style={[styles.networkText, { color: isOnline ? '#4ade80' : '#f87171' }]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* SYNC INDICATOR */}
      {syncPending && (
        <View style={styles.syncingBanner}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.syncingText}>Syncing offline cache with cloud...</Text>
        </View>
      )}

      {/* INPUT FORM (Stores in SQLite) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add Record (Offline-Ready)</Text>
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveUser}>
          <Save color="#fff" size={20} />
          <Text style={styles.buttonText}>Save Locally</Text>
        </TouchableOpacity>
      </View>

      {/* CHARTS RENDERED FROM LOCAL SQLITE DATA */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          SQLite Metrics <CloudLightning color="#8b5cf6" size={20} />
        </Text>
        {chartData.length > 0 ? (
           <BarChart
             data={chartData}
             barWidth={30}
             spacing={20}
             roundedTop
             roundedBottom
             hideRules
             xAxisThickness={0}
             yAxisThickness={0}
             yAxisTextStyle={{ color: 'gray' }}
             noOfSections={3}
             maxValue={100}
           />
        ) : (
          <Text style={styles.emptyText}>No data yet. Save a record.</Text>
        )}
      </View>

      {/* DATA LIST */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Local SQLite Database</Text>
        {userList.map((user) => (
          <View key={user.id} style={styles.row}>
            <View>
              <Text style={styles.rowTextBold}>{user.name}</Text>
              <Text style={styles.rowTextSmall}>{user.email}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: user.synced ? '#dcfce7' : '#fee2e2' }]}>
              <Text style={[styles.badgeText, { color: user.synced ? '#166534' : '#991b1b' }]}>
                {user.synced ? 'Synced' : 'Pending'}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f3f4f6',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  networkText: {
    fontWeight: '600',
  },
  syncingBanner: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  syncingText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  rowTextBold: {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: 16,
  },
  rowTextSmall: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyText: {
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 20,
  }
});
