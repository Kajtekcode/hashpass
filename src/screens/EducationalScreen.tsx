// src/screens/EducationalScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';

interface EducationalScreenProps {
  onContinue: () => void;
}

export default function EducationalScreen({ onContinue }: EducationalScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.lockIconWrapper}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Your security, simplified</Text>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          {/* Card 1 */}
          <View style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <Text style={styles.featureIcon}>🔑</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Your keys, your control</Text>
              <Text style={styles.featureDescription}>
                Only you have access. No one else can log in as you.
              </Text>
            </View>
          </View>

          {/* Card 2 */}
          <View style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <Text style={styles.featureIcon}>🔐</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Cryptographic signatures</Text>
              <Text style={styles.featureDescription}>
                Bitcoin-grade security protects every login.
              </Text>
            </View>
          </View>

          {/* Card 3 */}
          <View style={styles.featureCard}>
            <View style={styles.featureIconWrapper}>
              <Text style={styles.featureIcon}>📱</Text>
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>No central server</Text>
              <Text style={styles.featureDescription}>
                Everything stays on your device. No data leaks.
              </Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <Pressable style={styles.continueButton} onPress={onContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  lockIconWrapper: {
    width: 72,
    height: 72,
    backgroundColor: '#1a1a1a',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  lockIcon: {
    fontSize: 36,
    color: '#ffffff',
  },
  title: {
    fontSize: 29,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 52,
    letterSpacing: -0.6,
  },
  featuresContainer: {
    width: '100%',
    gap: 14,
    marginBottom: 70,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#161616',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#252525',
  },
  featureIconWrapper: {
    width: 48,
    height: 48,
    backgroundColor: '#222222',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  featureIcon: {
    fontSize: 23,
    color: '#cccccc',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16.5,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#aaaaaa',
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: '#ffffff',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#000000',
    fontSize: 17.5,
    fontWeight: '700',
  },
});