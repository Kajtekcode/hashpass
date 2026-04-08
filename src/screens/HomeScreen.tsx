// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { sessionService } from '../services/bitcoinService';

interface HomeScreenProps {
  onScanQR: () => void;
  onSettings: () => void;
  onActivity: () => void;        // New prop for "See all"
}

export default function HomeScreen({ onScanQR, onSettings, onActivity }: HomeScreenProps) {
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadRecentSessions();
  }, []);

  const loadRecentSessions = async () => {
    const sessions = await sessionService.getSessions();
    setRecentActivity(sessions);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>🔑</Text>
            </View>
            <View>
              <Text style={styles.appName}>Hash Pass</Text>
              <Text style={styles.appSubtitle}>Your secure keychain</Text>
            </View>
          </View>

          <Pressable style={styles.settingsButton} onPress={onSettings}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL LOGINS</Text>
            <Text style={styles.statValue}>47</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>THIS WEEK</Text>
            <Text style={styles.statValue}>12</Text>
          </View>
        </View>

        {/* Scan Card */}
        <Pressable style={styles.scanCard} onPress={onScanQR}>
          <View style={styles.scanIconContainer}>
            <Text style={styles.scanIcon}>📷</Text>
          </View>
          <Text style={styles.scanTitle}>Scan to login</Text>
          <Text style={styles.scanSubtitle}>Point camera at QR code</Text>
        </Pressable>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>RECENT ACTIVITY</Text>
            <Pressable onPress={onActivity}>
              <Text style={styles.seeAll}>See all →</Text>
            </Pressable>
          </View>

          {recentActivity.length > 0 ? recentActivity.map((item, index) => (
            <View key={index} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>🔶</Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{item.site}</Text>
                <Text style={styles.activityDomain}>{item.site}</Text>
              </View>
              <Text style={styles.activityTime}>
                {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          )) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No recent activity yet</Text>
              <Text style={styles.emptySubtext}>Scan a QR code to get started</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 48, height: 48, backgroundColor: '#ffffff', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  logoIcon: { fontSize: 26 },
  appName: { fontSize: 20, fontWeight: '700', color: '#ffffff' },
  appSubtitle: { fontSize: 13, color: '#888888' },
  settingsButton: { width: 44, height: 44, backgroundColor: '#1f1f1f', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingsIcon: { fontSize: 22 },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: { flex: 1, backgroundColor: '#161616', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#242424' },
  statLabel: { fontSize: 12, color: '#888888', marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: '700', color: '#ffffff' },
  scanCard: { backgroundColor: '#1a1a1a', borderRadius: 20, paddingVertical: 48, alignItems: 'center', marginBottom: 40, borderWidth: 1, borderColor: '#2a2a2a' },
  scanIconContainer: { width: 72, height: 72, backgroundColor: '#2a2a2a', borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  scanIcon: { fontSize: 36 },
  scanTitle: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 6 },
  scanSubtitle: { fontSize: 15, color: '#aaaaaa' },
  recentSection: { marginTop: 10 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  recentTitle: { fontSize: 13, fontWeight: '600', color: '#888888', letterSpacing: 0.5 },
  seeAll: { fontSize: 13, color: '#f59e0b' },
  activityCard: { flexDirection: 'row', backgroundColor: '#161616', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 10 },
  activityIcon: { width: 48, height: 48, backgroundColor: '#222222', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  activityEmoji: { fontSize: 24 },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  activityDomain: { fontSize: 13, color: '#aaaaaa' },
  activityTime: { fontSize: 13, color: '#666666' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#888888', fontSize: 16, marginBottom: 4 },
  emptySubtext: { color: '#666666', fontSize: 14 },
});