// src/screens/WelcomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      {/* Large Bitcoin Lock Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.bitcoinSymbol}>₿</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Hash Pass</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Bitcoin-powered passwordless login.{'\n'}
        Your private key is your universal identity.
      </Text>

      {/* Get Started Button - Matches HomeScreen style */}
      <Pressable style={styles.primaryButton} onPress={onGetStarted}>
        <Text style={styles.primaryButtonText}>GET STARTED</Text>
      </Pressable>

      {/* Security Note */}
      <View style={styles.securityNote}>
        <Text style={styles.securityText}>
          Strong Security Mode • Protected by BIP39 + BIP322
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  /* Icon Area */
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#1a1a1a',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
    borderWidth: 3,
    borderColor: '#f59e0b',
  },
  lockIcon: {
    fontSize: 78,
    color: '#f59e0b',
    opacity: 0.95,
  },
  bitcoinSymbol: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    fontSize: 32,
    color: '#f59e0b',
    fontWeight: '700',
  },

  /* Text */
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -1,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 17,
    color: '#aaaaaa',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 70,
  },

  /* Button */
  primaryButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },

  /* Footer Note */
  securityNote: {
    position: 'absolute',
    bottom: 50,
  },
  securityText: {
    color: '#666666',
    fontSize: 13.5,
    textAlign: 'center',
  },
});