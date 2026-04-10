// src/screens/SeedPhraseScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  Alert,
  Dimensions 
} from 'react-native';
import * as bip39 from 'bip39';
import * as Crypto from 'expo-crypto';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

const { width } = Dimensions.get('window');

interface SeedPhraseScreenProps {
  onBack: () => void;
  onContinue: (seedPhrase: string) => void;   // Now goes to Verify screen
}

export default function SeedPhraseScreen({ onBack, onContinue }: SeedPhraseScreenProps) {
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    generateSeedPhrase();
  }, []);

  const generateSeedPhrase = async () => {
    try {
      const randomBytes = Crypto.getRandomBytes(16);
      const entropyBuffer = Buffer.from(randomBytes);
      const mnemonic = bip39.entropyToMnemonic(entropyBuffer);

      const wordList = mnemonic.split(' ');
      setSeedPhrase(mnemonic);
      setWords(wordList);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate your recovery phrase');
    }
  };

  const handleContinue = () => {
    if (!seedPhrase) return;
    onContinue(seedPhrase);   // Pass seed to verification screen
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Recovery Phrase</Text>

        {/* 3-Column Grid */}
        <View style={styles.seedGrid}>
          {words.map((word, index) => (
            <View key={index} style={styles.wordItem}>
              <Text style={styles.wordNumber}>{index + 1}</Text>
              <Text style={styles.word}>{word}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.writeTitle}>Write these 12 words down</Text>

        <Text style={styles.warningText}>
          This is the only way to recover your wallet. 
          Keep it safe offline. Never share it, screenshot it, or store it digitally.
        </Text>

        <Pressable style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>I Have Written It Down</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 140,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
  },
  seedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  wordItem: {
    width: '31%',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  wordNumber: {
    fontSize: 15,
    color: '#888888',
    marginBottom: 4,
  },
  word: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
  },
  writeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  warningText: {
    fontSize: 15,
    color: '#ff9800',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
  },
  continueButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});