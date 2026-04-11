// src/screens/ActivityScreen.tsx
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

interface ActivityScreenProps {
  onBack: () => void;
  currentPin: string;
  refreshTrigger: number;
}

export default function ActivityScreen({ 
  onBack, 
  currentPin, 
  refreshTrigger 
}: ActivityScreenProps) {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoadingRef = useRef(false);

  const loadActivities = useCallback(async () => {
    if (!currentPin || currentPin.length !== 6) {
      setActivities([]);
      setLoading(false);
      return;
    }

    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    console.log('🔄 ActivityScreen - load called');

    setLoading(true);
    try {
      const fingerprint = await bitcoinService.getAccountFingerprint(currentPin);
      const sessions = await sessionService.getSessions(fingerprint);
      setActivities(sessions || []);
      console.log(`✅ ActivityScreen loaded ${sessions.length} sessions`);
    } catch (error: any) {
      console.log('❌ Activity load error:', error?.message || error);
      setActivities([]);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [currentPin]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities, refreshTrigger]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Activity</Text>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading activity...</Text>
        ) : activities.length > 0 ? (
          activities.map((item, index) => (
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
                <Text style={styles.activityTime}>{formatDate(item.timestamp)}</Text>
              </View>
              <View style={styles.greenDot} />
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No activity yet</Text>
            <Text style={styles.emptySubtext}>Your actions will appear here</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backButton: { padding: 8 },
  backText: { fontSize: 24, color: '#ffffff' },
  title: { fontSize: 22, fontWeight: '700', color: '#ffffff', marginLeft: 12 },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#161616',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  activityIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#222222',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityEmoji: { fontSize: 24 },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 17, fontWeight: '600', color: '#ffffff' },
  activityTime: { fontSize: 14, color: '#aaaaaa' },
  greenDot: { width: 10, height: 10, backgroundColor: '#22c55e', borderRadius: 5 },
  emptyState: { alignItems: 'center', paddingTop: 100 },
  emptyText: { color: '#888888', fontSize: 16 },
  emptySubtext: { color: '#666666', fontSize: 14, textAlign: 'center' },
  loadingText: { color: '#888888', textAlign: 'center', padding: 30 },
});