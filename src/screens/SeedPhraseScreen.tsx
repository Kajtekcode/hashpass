import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Dimensions } from 'react-native';
import * as bip39 from 'bip39';
import * as Crypto from 'expo-crypto';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

const { width } = Dimensions.get('window');

interface SeedPhraseScreenProps {
  onBack: () => void;
  onContinue: (seedPhrase: string) => void;
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
        onContinue(seedPhrase);   // Go directly to final success screen
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

        {/* Progress */}
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

        {/* Step 1: View Words */}
        {step === 'view' && (
          <>
            <Text style={styles.title}>Your Recovery Phrase</Text>
            <Text style={styles.subtitle}>Write these 12 words down on paper</Text>

            <View style={styles.seedGrid}>
              {words.map((word, index) => (
                <View key={index} style={styles.wordCard}>
                  <Text style={styles.wordNumber}>{(index + 1).toString().padStart(2, '0')}</Text>
                  <Text style={styles.word}>{word}</Text>
                </View>
              ))}
            </View>

            <Pressable style={styles.primaryButton} onPress={startQuiz}>
              <Text style={styles.primaryButtonText}>I've Saved Them</Text>
            </Pressable>
          </>
        )}

        {/* Step 2: Quiz */}
        {step === 'quiz' && (
          <>
            <Text style={styles.title}>Confirm Your Words</Text>
            <Text style={styles.subtitle}>Select the 3 words in the correct order</Text>

            <View style={styles.quizSlots}>
              {quizWords.map((_, index) => (
                <View key={index} style={styles.quizSlot}>
                  <Text style={styles.slotNumber}>{index + 1}</Text>
                  <Text style={styles.slotText}>{userAnswers[index] || '———'}</Text>
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

        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 50,
  },
  progressDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  progressActive: {
    backgroundColor: '#f7931a',
    width: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 24,
  },

  seedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 60,
  },
  wordCard: {
    backgroundColor: '#161616',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    width: (width - 72) / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  wordNumber: {
    fontSize: 13,
    color: '#f7931a',
    marginBottom: 8,
  },
  word: {
    fontSize: 16.5,
    color: '#ffffff',
    fontWeight: '500',
  },

  quizSlots: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 50,
  },
  quizSlot: {
    alignItems: 'center',
  },
  slotNumber: {
    fontSize: 15,
    color: '#666',
    marginBottom: 10,
  },
  slotText: {
    fontSize: 19,
    color: '#f7931a',
    fontWeight: '600',
    minWidth: 100,
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    minWidth: 120,
  },
  wordOptionSelected: {
    backgroundColor: '#f7931a',
  },
  wordOptionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },

  primaryButton: {
    backgroundColor: '#f7931a',
    paddingVertical: 16,        // Smaller button
    borderRadius: 14,
    width: '100%',
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },

  backButton: {
    marginTop: 40,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#777',
    fontSize: 16,
  },
});