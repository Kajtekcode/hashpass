import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

interface EducationalScreenProps {
  onContinue: () => void;
}

export default function EducationalScreen({ onContinue }: EducationalScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🔐</Text>
          <Text style={styles.title}>Your Master Recovery Key</Text>
        </View>

        <Text style={styles.description}>
          These 12 words are the only way to recover your account if you lose your phone.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Why these 12 words matter</Text>
          <Text style={styles.bullet}>• They control all your future login keys</Text>
          <Text style={styles.bullet}>• They work like a master password for Bitcoin</Text>
          <Text style={styles.bullet}>• No one can help you if they are lost</Text>
          <Text style={styles.bullet}>• Never store them digitally</Text>
        </View>

        <Text style={styles.warning}>
          You will see these words only once during setup.{'\n'}
          Please write them down on paper and store them securely.
        </Text>

        <Pressable style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryButtonText}>I Understand — Continue</Text>
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
    paddingTop: 100,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#161616',
    borderRadius: 20,
    padding: 24,
    marginBottom: 40,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f7931a',
    marginBottom: 16,
  },
  bullet: {
    fontSize: 16,
    color: '#ddd',
    lineHeight: 26,
    marginBottom: 12,
  },
  warning: {
    color: '#ff6b6b',
    fontSize: 15.5,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
  },
  primaryButton: {
    backgroundColor: '#f7931a',
    paddingVertical: 16,           // Smaller & balanced
    borderRadius: 14,
    width: '100%',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});