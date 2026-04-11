// src/screens/RegisteredSitesScreen.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bitcoinService, sessionService } from '../services/bitcoinService';

interface RegisteredSitesScreenProps {
  onBack: () => void;
  currentPin: string;
  refreshTrigger: number;
}

export default function RegisteredSitesScreen({ 
  onBack, 
  currentPin, 
  refreshTrigger 
}: RegisteredSitesScreenProps) {
  const [registeredSites, setRegisteredSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isLoadingRef = useRef(false);

  const loadRegisteredSites = useCallback(async () => {
    if (!currentPin || currentPin.length !== 6) {
      setRegisteredSites([]);
      setLoading(false);
      return;
    }

    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    console.log('🔄 RegisteredSitesScreen - load called');

    setLoading(true);
    try {
      const fingerprint = await bitcoinService.getAccountFingerprint(currentPin);
      const sessions = await sessionService.getSessions(fingerprint);

      const uniqueSites = Array.from(
        new Map(
          sessions
            .filter((item: any) => item.action === 'register')
            .map((item: any) => [item.site, item])
        ).values()
      );

      setRegisteredSites(uniqueSites);
      console.log(`✅ RegisteredSitesScreen loaded ${uniqueSites.length} unique sites`);
    } catch (error: any) {
      console.log('❌ Registered sites load error:', error?.message || error);
      setRegisteredSites([]);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [currentPin]);

  useEffect(() => {
    loadRegisteredSites();
  }, [loadRegisteredSites, refreshTrigger]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Registered Sites</Text>
        <View style={{ width: 50 }} />
      </View>
      <Text style={styles.subtitle}>Sites where you have an account</Text>
      <ScrollView style={styles.scroll}>
        {loading ? (
          <Text style={styles.loading}>Loading registered sites...</Text>
        ) : registeredSites.length > 0 ? (
          registeredSites.map((site: any, index: number) => (
            <View key={index} style={styles.siteCard}>
              <View style={styles.siteIcon}>
                <Text style={styles.siteEmoji}>🔶</Text>
              </View>
              <View style={styles.siteInfo}>
                <Text style={styles.siteName}>{site.site}</Text>
                <Text style={styles.siteDomain}>{site.site}</Text>
              </View>
              <View style={styles.statusDot} />
            </View>
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No registered sites yet</Text>
            <Text style={styles.emptySub}>Register on websites to see them here</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  backButton: { paddingVertical: 10 },
  backText: { color: '#f59e0b', fontSize: 17 },
  title: { fontSize: 20, fontWeight: '700', color: '#ffffff' },
  subtitle: {
    fontSize: 15,
    color: '#aaaaaa',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 20
  },
  scroll: { flex: 1 },
  siteCard: {
    flexDirection: 'row',
    backgroundColor: '#161616',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center'
  },
  siteIcon: {
    width: 52,
    height: 52,
    backgroundColor: '#222222',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  siteEmoji: { fontSize: 28 },
  siteInfo: { flex: 1 },
  siteName: { fontSize: 18, fontWeight: '600', color: '#ffffff' },
  siteDomain: { fontSize: 14, color: '#aaaaaa' },
  statusDot: {
    width: 10,
    height: 10,
    backgroundColor: '#22c55e',
    borderRadius: 5
  },
  empty: {
    alignItems: 'center',
    marginTop: 100
  },
  emptyText: { color: '#888888', fontSize: 18, marginBottom: 8 },
  emptySub: { color: '#666666', fontSize: 15, textAlign: 'center' },
  loading: {
    color: '#888888',
    textAlign: 'center',
    marginTop: 100
  },
});