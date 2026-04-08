// src/screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  Alert 
} from 'react-native';
import { settingsService } from '../services/bitcoinService';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  // Load current setting
  useEffect(() => {
    const loadSetting = async () => {
      const enabled = await settingsService.getBiometricsEnabled();
      setBiometricsEnabled(enabled);
    };
    loadSetting();
  }, []);

  const toggleBiometrics = async (value: boolean) => {
    setBiometricsEnabled(value);
    await settingsService.setBiometricsEnabled(value);
    
    Alert.alert(
      value ? 'Biometrics Enabled' : 'Biometrics Disabled',
      value 
        ? 'You can now use Face ID / Touch ID to unlock Hash Pass.' 
        : 'You will now use PIN only to unlock Hash Pass.',
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* App Info */}
        <View style={styles.card}>
          <View style={styles.appInfo}>
            <View style={styles.appIcon}>
              <Text style={styles.keyIcon}>🔑</Text>
            </View>
            <View>
              <Text style={styles.appName}>Hash Pass</Text>
              <Text style={styles.appSubtitle}>Protected by Bitcoin</Text>
            </View>
          </View>
        </View>

        {/* Biometric Lock - Functional Toggle */}
        <View style={styles.optionCard}>
          <View style={styles.optionLeft}>
            <View style={styles.optionIcon}>
              <Text style={styles.fingerprintIcon}>👆</Text>
            </View>
            <View>
              <Text style={styles.optionTitle}>Biometric lock</Text>
              <Text style={styles.optionSubtitle}>
                {biometricsEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
          <Switch
            value={biometricsEnabled}
            onValueChange={toggleBiometrics}
            trackColor={{ false: '#333', true: '#f59e0b' }}
            thumbColor="#fff"
          />
        </View>

        {/* Backup Keys */}
        <TouchableOpacity style={styles.optionCard}>
          <View style={styles.optionLeft}>
            <View style={styles.optionIcon}>
              <Text style={styles.shieldIcon}>🛡️</Text>
            </View>
            <View>
              <Text style={styles.optionTitle}>Backup keys</Text>
              <Text style={styles.optionSubtitle}>Export recovery</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity style={styles.optionCard}>
          <View style={styles.optionLeft}>
            <View style={styles.optionIcon}>
              <Text style={styles.helpIcon}>❓</Text>
            </View>
            <View>
              <Text style={styles.optionTitle}>Help & support</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  backText: {
    fontSize: 28,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },

  scrollContent: {
    padding: 20,
  },

  card: {
    backgroundColor: '#161616',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#222',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  keyIcon: { fontSize: 28 },
  appName: { fontSize: 20, fontWeight: '700', color: '#fff' },
  appSubtitle: { fontSize: 14, color: '#888', marginTop: 2 },

  optionCard: {
    backgroundColor: '#161616',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#222',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  fingerprintIcon: { fontSize: 24 },
  shieldIcon: { fontSize: 24 },
  helpIcon: { fontSize: 26 },

  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: '#666',
  },

  version: {
    marginTop: 40,
    textAlign: 'center',
    color: '#555',
    fontSize: 13,
  },
});