// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bitcoinService, sessionService } from '../services/bitcoinService';

interface HomeScreenProps {
  onScanQR: () => void;
  onSettings: () => void;
  onActivity: () => void;
  onRegisteredSites: () => void;
  currentPin: string;
  refreshTrigger: number;
}

export default function HomeScreen({
  onScanQR,
  onSettings,
  onActivity,
  onRegisteredSites,
  currentPin,
  refreshTrigger,
}: HomeScreenProps) {
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const cachedSessions = useRef<any[]>([]); // persistent cache across remounts

  const loadRecentActivity = useCallback(async (forceRefresh = false) => {
    if (!currentPin || currentPin.length !== 6) {
      setRecentActivity([]);
      return;
    }

    // Show cached data instantly for good UX
    if (cachedSessions.current.length > 0 && !forceRefresh) {
      setRecentActivity(cachedSessions.current);
    }

    setLoading(true);
    try {
      const fingerprint = await bitcoinService.getAccountFingerprint(currentPin);
      const sessions = await sessionService.getSessions(fingerprint);

      cachedSessions.current = sessions || [];
      setRecentActivity(sessions || []);
      console.log(`✅ HomeScreen loaded ${sessions.length} sessions (cached)`);
    } catch (error: any) {
      console.log('❌ Home load error:', error?.message || error);
    } finally {
      setLoading(false);
    }
  }, [currentPin]);

  // Load on mount or when refreshTrigger changes
  useEffect(() => {
    loadRecentActivity();
  }, [loadRecentActivity, refreshTrigger]);

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.logoContainer} onPress={onRegisteredSites}>
            <View style={styles.logo}>
              <Text style={styles.logoIcon}>🔑</Text>
            </View>
            <View>
              <Text style={styles.appName}>Hash Pass</Text>
              <Text style={styles.appSubtitle}>Your secure keychain</Text>
            </View>
          </Pressable>
          <Pressable style={styles.settingsButton} onPress={onSettings}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Pressable style={styles.statCard} onPress={onRegisteredSites}>
            <Text style={styles.statLabel}>REGISTERED SITES</Text>
            <Text style={styles.statValue}>
              {recentActivity.filter(s => s.action === 'register').length}
            </Text>
          </Pressable>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>THIS WEEK</Text>
            <Text style={styles.statValue}>
              {recentActivity.filter(item => {
                const d = new Date(item.timestamp);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return d > weekAgo;
              }).length}
            </Text>
          </View>
        </View>

        {/* Scan QR */}
        <Pressable style={styles.scanCard} onPress={onScanQR}>
          <View style={styles.scanIconContainer}>
            <Text style={styles.scanIcon}>📷</Text>
          </View>
          <Text style={styles.scanTitle}>Scan QR code</Text>
          <Text style={styles.scanSubtitle}>Register or login to websites</Text>
        </Pressable>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>RECENT ACTIVITY</Text>
            <Pressable onPress={() => loadRecentActivity(true)}>
              <Text style={styles.seeAll}>See all →</Text>
            </Pressable>
          </View>

          {/* Manual Refresh */}
          <Pressable 
            onPress={() => loadRecentActivity(true)}
            style={{ backgroundColor: '#f59e0b', padding: 12, borderRadius: 12, alignSelf: 'center', marginVertical: 10 }}
          >
            <Text style={{ color: '#000', fontWeight: '700' }}>↻ REFRESH NOW</Text>
          </Pressable>

          {loading && recentActivity.length === 0 ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : recentActivity.length > 0 ? (
            recentActivity.slice(0, 4).map((item, index) => (
              <View key={index} style={styles.activityCard}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityEmoji}>
                    {item.action === 'register' ? '🔑' : '✅'}
                  </Text>
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>
                    {item.action === 'register' ? 'Registered on' : 'Logged into'} {item.site}
                  </Text>
                  <Text style={styles.activityTime}>
                    {formatRelativeTime(item.timestamp)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No activity yet</Text>
              <Text style={styles.emptySubtext}>Your actions will appear here</Text>
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
  logo: { width: 52, height: 52, backgroundColor: '#ffffff', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  logoIcon: { fontSize: 28 },
  appName: { fontSize: 22, fontWeight: '700', color: '#ffffff' },
  appSubtitle: { fontSize: 14, color: '#aaaaaa' },
  settingsButton: { width: 48, height: 48, backgroundColor: '#1f1f1f', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  settingsIcon: { fontSize: 24 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: { flex: 1, backgroundColor: '#161616', borderRadius: 18, padding: 20 },
  statLabel: { fontSize: 12, color: '#888888', marginBottom: 8 },
  statValue: { fontSize: 32, fontWeight: '700', color: '#ffffff' },
  scanCard: { backgroundColor: '#1a1a1a', borderRadius: 24, paddingVertical: 52, alignItems: 'center', marginBottom: 40 },
  scanIconContainer: { width: 80, height: 80, backgroundColor: '#2a2a2a', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  scanIcon: { fontSize: 38 },
  scanTitle: { fontSize: 22, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
  scanSubtitle: { fontSize: 15, color: '#aaaaaa' },
  recentSection: { marginTop: 10 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  recentTitle: { fontSize: 13, fontWeight: '600', color: '#888888', letterSpacing: 0.5 },
  seeAll: { fontSize: 13, color: '#f59e0b' },
  activityCard: { flexDirection: 'row', backgroundColor: '#161616', borderRadius: 18, padding: 18, alignItems: 'center', marginBottom: 12 },
  activityIcon: { width: 50, height: 50, backgroundColor: '#222222', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  activityEmoji: { fontSize: 26 },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 17, fontWeight: '600', color: '#ffffff' },
  activityTime: { fontSize: 13, color: '#666666' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#888888', fontSize: 16, marginBottom: 4 },
  emptySubtext: { color: '#666666', fontSize: 14 },
  loadingText: { color: '#888888', textAlign: 'center', padding: 30 },
});