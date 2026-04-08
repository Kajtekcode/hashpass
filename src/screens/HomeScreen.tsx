// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { sessionService, settingsService } from '../services/bitcoinService';

interface HomeScreenProps {
  onScanQR: () => void;
  onSettings: () => void;        // To open Settings screen
}

export default function HomeScreen({ onScanQR, onSettings }: HomeScreenProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessions, setSessions] = useState(sessionService.getSessions());
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  const refreshSessions = useCallback(() => {
    setSessions(sessionService.getSessions());
  }, []);

  // Load biometrics preference
  useEffect(() => {
    const loadSettings = async () => {
      const enabled = await settingsService.getBiometricsEnabled();
      setBiometricsEnabled(enabled);
    };
    loadSettings();
  }, []);

  // Auto-unlock only if biometrics are enabled
  useEffect(() => {
    if (biometricsEnabled) {
      const timer = setTimeout(() => authenticateUser(), 800);
      return () => clearTimeout(timer);
    }
  }, [biometricsEnabled]);

  const authenticateUser = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Hash Pass',
      });
      if (result.success) {
        setIsAuthenticated(true);
        refreshSessions();
      }
    } catch (error) {
      console.log('Biometric unlock skipped or failed');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.shieldIcon}>
            <Text style={styles.shieldText}>🛡️</Text>
          </View>
          <Text style={styles.logo}>HASH PASS</Text>
        </View>
        
        {/* Settings Button */}
        <TouchableOpacity onPress={onSettings}>
          <Text style={styles.gear}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Active Public Key */}
      <View style={styles.publicKeyCard}>
        <Text style={styles.publicKeyLabel}>ACTIVE PUBLIC KEY</Text>
        <View style={styles.keyRow}>
          <Text style={styles.publicKey}>bc1qxy2k...yrf249</Text>
          <TouchableOpacity onPress={() => Alert.alert('Copied', 'Public key copied')}>
            <Text style={styles.copyIcon}>⎘</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SCAN QR CODE Button */}
      <Pressable style={styles.scanButton} onPress={onScanQR}>
        <Text style={styles.scanIcon}>📱</Text>
        <Text style={styles.scanText}>SCAN QR CODE</Text>
      </Pressable>

      <TouchableOpacity style={styles.howItWorks}>
        <Text style={styles.howItWorksText}>ⓘ How cryptographic login works</Text>
      </TouchableOpacity>

      {/* Recent Sessions */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>RECENT SESSIONS</Text>
          <TouchableOpacity onPress={refreshSessions}>
            <Text style={styles.manageText}>REFRESH</Text>
          </TouchableOpacity>
        </View>

        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No active sessions yet.{'\n'}
              Scan a QR code to start logging in.
            </Text>
          </View>
        ) : (
          sessions.map((session, index) => (
            <View key={index} style={styles.sessionCard}>
              <View style={styles.sessionRow}>
                <Text style={styles.sessionIcon}>🌐</Text>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionSite}>{session.site}</Text>
                  <Text style={styles.sessionStatus}>
                    {session.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Text style={[styles.navIcon, styles.activeNav]}>◉</Text>
          <Text style={[styles.navLabel, styles.activeNav]}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>🕒</Text>
          <Text style={styles.navLabel}>History</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>🛡️</Text>
          <Text style={styles.navLabel}>Security</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  shieldIcon: {
    width: 34,
    height: 34,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shieldText: { fontSize: 20, color: '#000' },
  logo: { fontSize: 23, fontWeight: '700', color: '#fff' },
  gear: { fontSize: 26, color: '#888' },

  publicKeyCard: {
    backgroundColor: '#161616',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  publicKeyLabel: { fontSize: 13, color: '#888', marginBottom: 6 },
  keyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  publicKey: { fontSize: 15, color: '#ddd', fontFamily: 'monospace' },
  copyIcon: { fontSize: 20, color: '#f59e0b' },

  scanButton: {
    backgroundColor: '#f59e0b',
    marginHorizontal: 20,
    marginTop: 32,
    paddingVertical: 17,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  scanIcon: { fontSize: 22 },
  scanText: { color: '#000', fontSize: 17.5, fontWeight: '700' },

  howItWorks: { marginTop: 20, alignItems: 'center' },
  howItWorksText: { color: '#888', fontSize: 15 },

  recentSection: { marginHorizontal: 20, marginTop: 36 },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  recentTitle: { fontSize: 15, fontWeight: '600', color: '#fff' },
  manageText: { color: '#f59e0b', fontSize: 14, fontWeight: '600' },

  sessionCard: {
    backgroundColor: '#161616',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  sessionRow: { flexDirection: 'row', alignItems: 'center' },
  sessionIcon: { fontSize: 26, marginRight: 14 },
  sessionInfo: { flex: 1 },
  sessionSite: { fontSize: 16.5, color: '#fff', fontWeight: '600' },
  sessionStatus: { fontSize: 13, color: '#888', marginTop: 4 },
  chevron: { fontSize: 22, color: '#666' },

  emptyState: {
    backgroundColor: '#161616',
    padding: 24,
    borderRadius: 14,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: { alignItems: 'center' },
  navIcon: { fontSize: 24, marginBottom: 4, color: '#666' },
  navLabel: { fontSize: 11, color: '#666' },
  activeNav: { color: '#f59e0b' },
});