// src/screens/KeyDisplayScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView 
} from 'react-native';

interface KeyDisplayScreenProps {
  onBack: () => void;
  onDone: () => void;
}

export default function KeyDisplayScreen({ onBack, onDone }: KeyDisplayScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>You're All Set</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Your Bitcoin-powered login key has been created successfully.{'\n'}
          It has been stored securely in the app.
        </Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoText}>
            • Scan a QR code on any supported website{'\n'}
            • Confirm with Face ID or Touch ID{'\n'}
            • Login instantly — no passwords needed
          </Text>
        </View>

        {/* Primary Button */}
        <Pressable style={styles.primaryButton} onPress={onDone}>
          <Text style={styles.primaryButtonText}>CONTINUE TO HASH PASS</Text>
        </Pressable>

        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
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
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 60,
    alignItems: 'center',
  },

  /* Success Icon */
  successIconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#1a1a1a',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  successEmoji: {
    fontSize: 52,
  },

  /* Text */
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 16.5,
    color: '#aaaaaa',
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 50,
  },

  /* Info Card */
  infoCard: {
    backgroundColor: '#161616',
    borderRadius: 18,
    padding: 24,
    marginBottom: 60,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  infoTitle: {
    fontSize: 17.5,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 15.5,
    color: '#ddd',
    lineHeight: 26,
  },

  /* Button */
  primaryButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 17,
    borderRadius: 16,
    width: '100%',
    marginBottom: 30,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#777',
    fontSize: 15.5,
  },
});