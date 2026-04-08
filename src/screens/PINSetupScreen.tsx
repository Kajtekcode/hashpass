// src/screens/PINSetupScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  TextInput, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { bitcoinService } from '../services/bitcoinService';

interface PINSetupScreenProps {
  seedPhrase: string;
  onComplete: () => void;
  onBack: () => void;
}

export default function PINSetupScreen({ seedPhrase, onComplete, onBack }: PINSetupScreenProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [isLoading, setIsLoading] = useState(false);

  const canContinue = step === 'create' 
    ? pin.length === 6 
    : confirmPin.length === 6;

  const handleCreatePIN = () => {
    if (pin.length !== 6) {
      Alert.alert('Invalid PIN', 'Please enter exactly 6 digits.');
      return;
    }
    setStep('confirm');
    setConfirmPin(''); // Clear confirm field
  };

  const handleConfirmPIN = async () => {
    if (pin !== confirmPin) {
      Alert.alert("PINs Don't Match", "Please try again.");
      setConfirmPin('');
      return;
    }

    setIsLoading(true);

    try {
      await bitcoinService.saveEncryptedMnemonic(seedPhrase, pin);
      console.log('✅ Seed phrase encrypted and saved successfully');

      Alert.alert('Setup Complete', 'Your recovery phrase is now securely protected.', [
        { text: 'Continue to Hash Pass', onPress: onComplete }
      ]);
    } catch (error: any) {
      console.error('Encryption error:', error);
      Alert.alert('Error', 'Failed to save your recovery phrase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔑</Text>
        </View>

        <Text style={styles.title}>
          {step === 'create' ? 'Create 6-Digit PIN' : 'Confirm Your PIN'}
        </Text>
        
        <Text style={styles.subtitle}>
          {step === 'create' 
            ? 'This PIN protects your Bitcoin recovery phrase.' 
            : 'Re-enter the same 6 digits to confirm'}
        </Text>

        <TextInput
          style={styles.pinInput}
          value={step === 'create' ? pin : confirmPin}
          onChangeText={step === 'create' ? setPin : setConfirmPin}
          keyboardType="number-pad"
          maxLength={6}
          secureTextEntry
          textAlign="center"
          placeholder="••••••"
          placeholderTextColor="#555"
        />

        <Pressable 
          style={[styles.primaryButton, !canContinue && styles.buttonDisabled]}
          onPress={step === 'create' ? handleCreatePIN : handleConfirmPIN}
          disabled={!canContinue || isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading 
              ? 'Saving Securely...' 
              : (step === 'create' ? 'Continue' : 'Confirm PIN')
            }
          </Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0a0a0a' 
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#1a1a1a',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  icon: { fontSize: 42 },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15.5,
    color: '#aaaaaa',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 50,
  },
  pinInput: {
    backgroundColor: '#161616',
    color: '#fff',
    fontSize: 34,
    letterSpacing: 16,
    paddingVertical: 22,
    borderRadius: 16,
    width: 240,
    textAlign: 'center',
    marginBottom: 60,
  },
  primaryButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#333',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 50,
  },
  backButtonText: {
    color: '#777',
    fontSize: 16,
  },
});