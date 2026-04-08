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
  onContinue: (seedPhrase: string) => void;   // Pass seed to PIN screen
}

type Step = 'view' | 'quiz';

export default function SeedPhraseScreen({ onBack, onContinue }: SeedPhraseScreenProps) {
  const [step, setStep] = useState<Step>('view');
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [quizWords, setQuizWords] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

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

  const startQuiz = () => {
    if (words.length === 0) return;

    const indices = new Set<number>();
    while (indices.size < 3) {
      indices.add(Math.floor(Math.random() * words.length));
    }

    const selectedIndices = Array.from(indices).sort((a, b) => a - b);
    const selectedWords = selectedIndices.map(i => words[i]);

    setQuizWords(selectedWords);
    setUserAnswers([]);
    setStep('quiz');
  };

  const handleSelectWord = (word: string) => {
    if (userAnswers.length >= 3) return;

    const newAnswers = [...userAnswers, word];
    setUserAnswers(newAnswers);

    if (newAnswers.length === 3) {
      const isCorrect = newAnswers.every((answer, index) => answer === quizWords[index]);

      if (isCorrect) {
        onContinue(seedPhrase);   // Pass raw seed to PIN screen for encryption
      } else {
        Alert.alert("Not Quite Right", "The order was incorrect. Let's try again.", [
          { text: "Try Again", onPress: () => setUserAnswers([]) }
        ]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.progressContainer}>
          {[1, 2].map((num) => (
            <View
              key={num}
              style={[
                styles.progressDot,
                (step === 'view' && num === 1) || (step === 'quiz' && num === 2) 
                  ? styles.progressActive 
                  : {}
              ]}
            />
          ))}
        </View>

        {step === 'view' && (
          <>
            <Text style={styles.title}>Your Recovery Phrase</Text>
            <Text style={styles.subtitle}>
              Write these 12 words down on paper.{'\n'}
              They are the only way to recover your account.
            </Text>

            <View style={styles.seedGrid}>
              {words.map((word, index) => (
                <View key={index} style={styles.wordCard}>
                  <Text style={styles.wordNumber}>{(index + 1).toString().padStart(2, '0')}</Text>
                  <Text style={styles.word}>{word}</Text>
                </View>
              ))}
            </View>

            <Pressable style={styles.primaryButton} onPress={startQuiz}>
              <Text style={styles.primaryButtonText}>I'VE SAVED THEM SECURELY</Text>
            </Pressable>
          </>
        )}

        {step === 'quiz' && (
          <>
            <Text style={styles.title}>Confirm Your Words</Text>
            <Text style={styles.subtitle}>
              Select the 3 words in the exact correct order
            </Text>

            <View style={styles.quizSlots}>
              {quizWords.map((_, index) => (
                <View key={index} style={styles.quizSlot}>
                  <Text style={styles.slotNumber}>{index + 1}</Text>
                  <Text style={styles.slotText}>
                    {userAnswers[index] || '———'}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.optionsContainer}>
              {quizWords.map((word) => (
                <Pressable
                  key={word}
                  style={[
                    styles.wordOption,
                    userAnswers.includes(word) && styles.wordOptionSelected
                  ]}
                  onPress={() => handleSelectWord(word)}
                  disabled={userAnswers.includes(word)}
                >
                  <Text style={styles.wordOptionText}>{word}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 120,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  progressActive: {
    backgroundColor: '#f59e0b',
    width: 32,
  },
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
    lineHeight: 23,
    marginBottom: 48,
  },
  seedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 50,
  },
  wordCard: {
    backgroundColor: '#161616',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    width: (width - 72) / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  wordNumber: {
    fontSize: 12.5,
    color: '#f59e0b',
    marginBottom: 6,
  },
  word: {
    fontSize: 15.5,
    color: '#ffffff',
    fontWeight: '500',
  },
  quizSlots: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 50,
  },
  quizSlot: {
    alignItems: 'center',
    width: 90,
  },
  slotNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  slotText: {
    fontSize: 18,
    color: '#f59e0b',
    fontWeight: '600',
    minHeight: 28,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  wordOption: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: 14,
    minWidth: 110,
  },
  wordOptionSelected: {
    backgroundColor: '#f59e0b',
  },
  wordOptionText: {
    color: '#fff',
    fontSize: 15.5,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 17,
    borderRadius: 14,
    width: '100%',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 50,
    alignSelf: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#777',
    fontSize: 16,
  },
});