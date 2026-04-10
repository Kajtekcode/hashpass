// src/screens/UnlockScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  TextInput,
  Alert,
  ScrollView 
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { settingsService } from '../services/bitcoinService';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UnlockScreenProps {
  onUnlockSuccess: () => void;
}

export default function UnlockScreen({ onUnlockSuccess }: UnlockScreenProps) {
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [pinInput, setPinInput] = useState('');

  useEffect(() => {
    checkBiometricsPreference();
  }, []);

  const checkBiometricsPreference = async () => {
    const enabled = await settingsService.getBiometricsEnabled();
    setBiometricsEnabled(enabled);
    if (!enabled) {
      // Biometrics disabled → immediately show PIN input
    }
  };

  const tryBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Hash Pass',
      });
      if (result.success) onUnlockSuccess();
    } catch (e) {}
  };

  const handlePinSubmit = () => {
    if (pinInput.length === 6) {
      onUnlockSuccess();
    } else {
      Alert.alert('Invalid PIN', 'Please enter 6 digits.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔑</Text>
        </View>

        <Text style={styles.title}>Unlock Hash Pass</Text>
        <Text style={styles.subtitle}>Secure access to your Bitcoin wallet</Text>

        {biometricsEnabled && (
          <Pressable style={styles.biometricsButton} onPress={tryBiometrics}>
            <Text style={styles.biometricsButtonText}>Unlock with Biometrics</Text>
          </Pressable>
        )}

        {/* PIN Input - always visible when biometrics disabled */}
        <View style={styles.pinContainer}>
          <TextInput
            style={styles.pinInput}
            value={pinInput}
            onChangeText={setPinInput}
            keyboardType="number-pad"
            maxLength={6}
            secureTextEntry
            placeholder="••••••"
            placeholderTextColor="#666"
            autoFocus={!biometricsEnabled}
          />
        </View>

        {/* Extra space for keyboard */}
        <View style={{ height: 220 }} />
      </ScrollView>

      {/* Fixed Unlock button - always visible at bottom */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.verifyButton} onPress={handlePinSubmit}>
          <Text style={styles.verifyButtonText}>Unlock</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 100,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    alignSelf: 'center',
  },
  icon: { fontSize: 48 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    marginBottom: 60,
  },
  biometricsButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 18,
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  biometricsButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  pinContainer: {
    width: '100%',
    alignItems: 'center',
  },
  pinInput: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    fontSize: 32,
    letterSpacing: 12,
    paddingVertical: 16,
    borderRadius: 16,
    width: 240,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  verifyButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});