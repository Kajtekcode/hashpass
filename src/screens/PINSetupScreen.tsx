// src/screens/PINSetupScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Alert,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PINSetupScreenProps {
  seedPhrase: string;
  onComplete: (pin: string) => void;
  onBack: () => void;
}

export default function PINSetupScreen({ seedPhrase, onComplete, onBack }: PINSetupScreenProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');

  const currentValue = step === 'create' ? pin : confirmPin;
  const dots = Array(6).fill(0).map((_, i) => i < currentValue.length);

  const handleKeyPress = (key: string) => {
    if (step === 'create') {
      if (pin.length < 6) setPin(pin + key);
    } else {
      if (confirmPin.length < 6) setConfirmPin(confirmPin + key);
    }
  };

  const handleDelete = () => {
    if (step === 'create') {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const handleContinue = () => {
    if (step === 'create') {
      if (pin.length !== 6) {
        Alert.alert('Invalid PIN', 'Please enter exactly 6 digits.');
        return;
      }
      setStep('confirm');
      setConfirmPin('');
    } else {
      if (pin !== confirmPin) {
        Alert.alert("PINs Don't Match", "Please try again.");
        setConfirmPin('');
        return;
      }
      onComplete(pin);
    }
  };

  const isComplete = step === 'create' ? pin.length === 6 : confirmPin.length === 6;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {step === 'create' ? 'Create your PIN' : 'Confirm your PIN'}
        </Text>
        
        <Text style={styles.subtitle}>
          {step === 'create' 
            ? 'Choose a 6-digit PIN to secure your wallet' 
            : 'Re-enter your PIN to confirm'}
        </Text>

        <View style={styles.dotsContainer}>
          {dots.map((filled, i) => (
            <View key={i} style={[styles.dot, filled && styles.dotFilled]} />
          ))}
        </View>

        <View style={styles.keypad}>
          {[1,2,3,4,5,6,7,8,9].map((num) => (
            <Pressable 
              key={num} 
              style={styles.key} 
              onPress={() => handleKeyPress(num.toString())}
            >
              <Text style={styles.keyText}>{num}</Text>
            </Pressable>
          ))}

          <View style={styles.spacer} />

          <Pressable 
            style={styles.key} 
            onPress={() => handleKeyPress('0')}
          >
            <Text style={styles.keyText}>0</Text>
          </Pressable>

          <Pressable 
            style={styles.deleteKey} 
            onPress={handleDelete}
          >
            <Text style={styles.deleteText}>⌫</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Fixed button */}
      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.continueButton, !isComplete && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!isComplete}
        >
          <Text style={styles.continueButtonText}>
            {step === 'create' ? 'Continue' : 'Confirm PIN'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000000' 
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,        // smaller top margin (half of previous)
    paddingBottom: 180,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#aaaaaa',
    textAlign: 'center',
    marginBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 50,
    justifyContent: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#333',
  },
  dotFilled: {
    backgroundColor: '#f59e0b',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: 300,
    gap: 12,
    justifyContent: 'center',
  },
  key: {
    width: 72,
    height: 72,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 26,
    color: '#ffffff',
    fontWeight: '500',
  },
  spacer: {
    width: 72,
    height: 72,
  },
  deleteKey: {
    width: 72,
    height: 72,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 24,
    color: '#ff6b6b',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  continueButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#444',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});