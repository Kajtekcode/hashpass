// src/screens/EducationalScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface EducationalScreenProps {
  onContinue: () => void;
}

export default function EducationalScreen({ onContinue }: EducationalScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>How it works</Text>
        <Text style={styles.subtitle}>Secure, simple, and private</Text>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {/* Card 1 */}
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✓</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Instant login</Text>
            <Text style={styles.cardDescription}>
              Scan QR code, confirm with biometrics, done. No passwords to remember.
            </Text>
          </View>
        </View>

        {/* Card 2 */}
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🛡️</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>Bitcoin-grade security</Text>
            <Text style={styles.cardDescription}>
              Cryptographic signatures protect every login with proven technology.
            </Text>
          </View>
        </View>

        {/* Card 3 */}
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔑</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>You own your keys</Text>
            <Text style={styles.cardDescription}>
              No servers, no data leaks, total privacy. Only you have control.
            </Text>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 31,           // reduced
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,           // reduced
    color: '#aaaaaa',
    textAlign: 'center',
  },
  cardsContainer: {
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 110,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    alignItems: 'center',
  },
  iconContainer: {
    width: 46,
    height: 46,
    backgroundColor: '#2a2a2a',
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  icon: {
    fontSize: 24,
    color: '#ffffff',
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,           // reduced
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,           // reduced
    color: '#aaaaaa',
    lineHeight: 21,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 17.5,
    fontWeight: '700',
  },
});