// src/screens/BiometricsSetupScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Alert 
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { settingsService } from '../services/bitcoinService';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BiometricsSetupScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function BiometricsSetupScreen({ onComplete, onSkip }: BiometricsSetupScreenProps) {

  const handleEnableBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert("Not Supported", "Your device does not support Face ID or Touch ID.");
        onSkip();
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable Biometrics for Hash Pass',
      });

      if (result.success) {
        await settingsService.setBiometricsEnabled(true);
        onComplete();
      } else {
        Alert.alert("Cancelled", "Biometrics setup was cancelled.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to enable biometrics.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.fingerprintIcon}>🔎</Text>
        </View>

        <Text style={styles.title}>Enable Biometrics</Text>
        <Text style={styles.subtitle}>
          Use Face ID or Touch ID for faster and more secure access to your wallet
        </Text>

        <Pressable style={styles.primaryButton} onPress={handleEnableBiometrics}>
          <Text style={styles.primaryButtonText}>Enable Biometrics</Text>
        </Pressable>

        <Pressable style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 110,
    height: 110,
    backgroundColor: '#1a1a1a',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  fingerprintIcon: {
    fontSize: 68,
    color: '#f59e0b',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 80,
  },
  primaryButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 18,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#777777',
    fontSize: 16,
  },
});