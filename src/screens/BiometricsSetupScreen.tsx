// src/screens/BiometricsSetupScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Alert 
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { settingsService } from '../services/bitcoinService';

interface BiometricsSetupScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function BiometricsSetupScreen({ onComplete, onSkip }: BiometricsSetupScreenProps) {
  const [biometricType, setBiometricType] = useState<'Face ID' | 'Touch ID' | 'None'>('None');

  useEffect(() => {
    detectBiometricType();
  }, []);

  const detectBiometricType = async () => {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      setBiometricType('Face ID');
    } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      setBiometricType('Touch ID');
    } else {
      setBiometricType('None');
    }
  };

  const enableBiometrics = async () => {
    if (biometricType === 'None') {
      Alert.alert('No Biometrics', 'No biometric hardware detected.');
      await settingsService.setBiometricsEnabled(false);
      onSkip();
      return;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Enable ${biometricType} for Hash Pass?`,
      });

      if (result.success) {
        await settingsService.setBiometricsEnabled(true);
        Alert.alert('✅ Success', `${biometricType} has been enabled.`);
        onComplete();
      } else {
        await settingsService.setBiometricsEnabled(false);
        onSkip();
      }
    } catch (error) {
      await settingsService.setBiometricsEnabled(false);
      onSkip();
    }
  };

  const handleUsePinOnly = async () => {
    await settingsService.setBiometricsEnabled(false);
    Alert.alert(
      'PIN Only Mode', 
      'Biometrics disabled. You will use PIN as fallback.',
      [{ text: 'OK', onPress: onSkip }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.emoji}>🔐</Text>
      </View>

      <Text style={styles.title}>Enable Quick Unlock?</Text>
      <Text style={styles.subtitle}>
        Use {biometricType === 'None' ? 'a secure PIN' : biometricType} to unlock faster.
      </Text>

      <Text style={styles.recommendation}>
        Recommended for best experience
      </Text>

      <Pressable style={styles.primaryButton} onPress={enableBiometrics}>
        <Text style={styles.primaryButtonText}>
          Enable {biometricType === 'None' ? 'PIN Unlock' : biometricType}
        </Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={handleUsePinOnly}>
        <Text style={styles.secondaryButtonText}>Use PIN Only</Text>
      </Pressable>

      <Text style={styles.note}>
        You can change this anytime in Settings
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#1a1a1a',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 3,
    borderColor: '#f59e0b',
  },
  emoji: { fontSize: 58 },
  title: { fontSize: 30, fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16.5, color: '#ccc', textAlign: 'center', lineHeight: 26, marginBottom: 40 },
  recommendation: { color: '#f59e0b', fontSize: 16, fontWeight: '600', marginBottom: 60, textAlign: 'center' },
  primaryButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    marginBottom: 16,
  },
  primaryButtonText: { color: '#000', fontSize: 17.5, fontWeight: '700', textAlign: 'center' },
  secondaryButton: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#333',
  },
  secondaryButtonText: { color: '#f59e0b', fontSize: 17, fontWeight: '600', textAlign: 'center' },
  note: { marginTop: 70, color: '#666', fontSize: 14.5, textAlign: 'center' },
});