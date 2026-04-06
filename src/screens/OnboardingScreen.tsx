import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SecurityOption from '../components/SecurityOption';

interface OnboardingScreenProps {
  onChooseStrong: () => void;
  onChooseNormal: () => void;
}

export default function OnboardingScreen({
  onChooseStrong,
  onChooseNormal,
}: OnboardingScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Security Level</Text>

      <SecurityOption
        title="Strong Security"
        subtitle="12-word seed phrase (Bitcoin standard — maximum security)"
        onPress={onChooseStrong}
      />

      <SecurityOption
        title="Normal Security"
        subtitle="Easy recovery with short code (simpler but slightly less secure)"
        onPress={onChooseNormal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
  },
});