// src/screens/EducationalScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView 
} from 'react-native';

interface EducationalScreenProps {
  onContinue: () => void;
}

export default function EducationalScreen({ onContinue }: EducationalScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header Icon + Title */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>🔐</Text>
          </View>
          <Text style={styles.title}>Your Master Recovery Key</Text>
          <Text style={styles.subtitle}>
            12 words that control your entire Bitcoin identity
          </Text>
        </View>

        {/* Main Description */}
        <Text style={styles.description}>
          These 12 words are the **only** way to recover your account if you lose your phone or device.
        </Text>

        {/* Why It Matters Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Why these 12 words matter</Text>
          
          <View style={styles.bulletContainer}>
            <Text style={styles.bullet}>• They control all your future login keys</Text>
            <Text style={styles.bullet}>• They act as your master Bitcoin key</Text>
            <Text style={styles.bullet}>• No one can recover them for you — ever</Text>
            <Text style={styles.bullet}>• Never store them digitally or in a screenshot</Text>
          </View>
        </View>

        {/* Warning */}
        <View style={styles.warningContainer}>
          <Text style={styles.warning}>
            You will see these words only once during setup.{'\n'}
            Write them down on paper and store them in a safe place.
          </Text>
        </View>

        {/* Continue Button */}
        <Pressable style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryButtonText}>I UNDERSTAND — CONTINUE</Text>
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
    paddingTop: 80,
    paddingBottom: 100,
  },

  /* Header */
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 88,
    height: 88,
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  emoji: {
    fontSize: 52,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16.5,
    color: '#f59e0b',
    textAlign: 'center',
    fontWeight: '600',
  },

  /* Description */
  description: {
    fontSize: 17,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },

  /* Card */
  card: {
    backgroundColor: '#161616',
    borderRadius: 18,
    padding: 24,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 18,
  },
  bulletContainer: {
    gap: 14,
  },
  bullet: {
    fontSize: 15.5,
    color: '#ddd',
    lineHeight: 24,
  },

  /* Warning */
  warningContainer: {
    marginBottom: 60,
  },
  warning: {
    color: '#ff6b6b',
    fontSize: 15.5,
    textAlign: 'center',
    lineHeight: 24,
  },

  /* Button */
  primaryButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 17.5,
    fontWeight: '700',
    textAlign: 'center',
  },
});