// src/screens/VerifyRecoveryScreen.tsx
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
import { SafeAreaView } from 'react-native-safe-area-context';

interface VerifyRecoveryScreenProps {
  seedPhrase: string;
  onBack: () => void;
  onContinue: () => void;
}

export default function VerifyRecoveryScreen({ 
  seedPhrase, 
  onBack, 
  onContinue 
}: VerifyRecoveryScreenProps) {
  const words = seedPhrase.split(' ');
  
  const [quizIndices, setQuizIndices] = useState<number[]>([]);
  const [inputs, setInputs] = useState<string[]>(['', '', '']);

  useEffect(() => {
    const indices = new Set<number>();
    while (indices.size < 3) {
      indices.add(Math.floor(Math.random() * 12));
    }
    setQuizIndices(Array.from(indices).sort((a, b) => a - b));
    setInputs(['', '', '']);
  }, [seedPhrase]);

  const handleInputChange = (index: number, text: string) => {
    const newInputs = [...inputs];
    newInputs[index] = text.toLowerCase().trim();
    setInputs(newInputs);
  };

  const handleVerify = () => {
    const isCorrect = inputs.every((input, idx) => input === words[quizIndices[idx]]);

    if (isCorrect) {
      onContinue();
    } else {
      Alert.alert("Incorrect", "The words don't match. Please try again.", [
        { text: "Try Again", onPress: () => setInputs(['', '', '']) }
      ]);
    }
  };

  const allFilled = inputs.every(input => input.length > 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Verify Recovery Phrase</Text>
        <Text style={styles.subtitle}>
          Enter words {quizIndices[0] + 1}, {quizIndices[1] + 1}, and {quizIndices[2] + 1} from your list
        </Text>

        {quizIndices.map((originalIndex, inputIndex) => (
          <View key={inputIndex} style={styles.inputGroup}>
            <Text style={styles.label}>Word {originalIndex + 1}</Text>
            <TextInput
              style={styles.input}
              value={inputs[inputIndex]}
              onChangeText={(text) => handleInputChange(inputIndex, text)}
              placeholder={`Enter word ${originalIndex + 1}`}
              placeholderTextColor="#666"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        ))}

        {/* Extra space so content doesn't get hidden */}
        <View style={{ height: 180 }} />
      </ScrollView>

      {/* Fixed button at bottom */}
      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.verifyButton, !allFilled && styles.buttonDisabled]} 
          onPress={handleVerify}
          disabled={!allFilled}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
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
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 17,
    color: '#aaaaaa',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 50,
  },
  inputGroup: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    fontSize: 17,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  verifyButton: {
    backgroundColor: '#d97706',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#555',
  },
  verifyButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});