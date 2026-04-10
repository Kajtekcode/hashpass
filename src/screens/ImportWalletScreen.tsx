// src/screens/ImportWalletScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ImportWalletScreenProps {
  onBack: () => void;
  onContinue: (mnemonic: string) => void;
}

export default function ImportWalletScreen({ onBack, onContinue }: ImportWalletScreenProps) {
  const [words, setWords] = useState<string[]>(Array(12).fill(''));

  const handleWordChange = (index: number, text: string) => {
    const newWords = [...words];
    newWords[index] = text.toLowerCase().trim();
    setWords(newWords);
  };

  const isComplete = words.every(word => word.length > 0);

  const handleContinue = () => {
    const mnemonic = words.join(' ');
    onContinue(mnemonic);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Pressable onPress={onBack}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
            <Text style={styles.title}>Import Wallet</Text>
          </View>

          <Text style={styles.instruction}>Enter your 12-word recovery phrase</Text>

          <View style={styles.grid}>
            {words.map((word, index) => (
              <View key={index} style={styles.wordInputContainer}>
                <Text style={styles.wordNumber}>{index + 1}.</Text>
                <TextInput
                  style={styles.wordInput}
                  value={word}
                  onChangeText={(text) => handleWordChange(index, text)}
                  placeholder="word"
                  placeholderTextColor="#555"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Fixed button at bottom */}
        <View style={styles.buttonContainer}>
          <Pressable 
            style={[styles.button, !isComplete && styles.buttonDisabled]} 
            onPress={handleContinue}
            disabled={!isComplete}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backText: {
    color: '#f59e0b',
    fontSize: 17,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 20,
  },
  instruction: {
    fontSize: 17,
    color: '#aaaaaa',
    textAlign: 'center',
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  wordInputContainer: {
    width: '48%',
    marginBottom: 12,
  },
  wordNumber: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 6,
  },
  wordInput: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#333333',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#f59e0b',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#444444',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});