import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

interface KeyDisplayScreenProps {
  seedPhrase: string;
  onBack: () => void;
  onDone: () => void;
}

export default function KeyDisplayScreen({ onBack, onDone }: KeyDisplayScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.title}>You're All Set</Text>
          <Text style={styles.subtitle}>
            Your Bitcoin-powered login key has been created successfully.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoText}>
            • Scan a QR code on any supported website{'\n'}
            • Confirm with Face ID or Touch ID{'\n'}
            • Login instantly — no passwords needed
          </Text>
        </View>

        <Pressable style={styles.primaryButton} onPress={onDone}>
          <Text style={styles.primaryButtonText}>Continue to Hash Pass</Text>
        </Pressable>

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
    paddingTop: 120,
    paddingBottom: 40,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  successEmoji: {
    fontSize: 96,
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaaaaa',
    textAlign: 'center',
    lineHeight: 28,
  },
  infoCard: {
    backgroundColor: '#161616',
    borderRadius: 20,
    padding: 28,
    marginBottom: 50,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f7931a',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#ddd',
    lineHeight: 28,
  },
  primaryButton: {
    backgroundColor: '#f7931a',
    paddingVertical: 16,           // Smaller & consistent
    borderRadius: 14,
    width: '100%',
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