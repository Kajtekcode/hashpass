// src/screens/WelcomeScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Text style={styles.keyIcon}>🔑</Text>
          </View>
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Hash Pass</Text>
        <Text style={styles.subtitle}>Login without passwords</Text>

        {/* Feature Cards */}
        <View style={styles.featuresContainer}>
          {/* Card 1 - Instant login */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#854D0E' }]}>
              <Text style={styles.featureIcon}>⚡</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Instant login</Text>
              <Text style={styles.featureDescription}>
                Scan QR code, confirm with biometrics, done
              </Text>
            </View>
          </View>

          {/* Card 2 - Bitcoin-grade security */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#9C4221' }]}>
              <Text style={styles.featureIcon}>🛡️</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Bitcoin-grade security</Text>
              <Text style={styles.featureDescription}>
                Cryptographic signatures protect every login
              </Text>
            </View>
          </View>

          {/* Card 3 - You own your keys */}
          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#1E3A8A' }]}>
              <Text style={styles.featureIcon}>🔒</Text>
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>You own your keys</Text>
              <Text style={styles.featureDescription}>
                No servers, no data leaks, total privacy
              </Text>
            </View>
          </View>
        </View>

        {/* Get Started Button */}
        <Pressable style={styles.getStartedButton} onPress={onGetStarted}>
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </Pressable>

        {/* Bottom Tags */}
        <View style={styles.bottomTags}>
          <View style={styles.tag}>
            <Text style={styles.tagIcon}>📱</Text>
            <Text style={styles.tagText}>Biometric</Text>
          </View>
          <View style={styles.tagDot} />
          <View style={styles.tag}>
            <Text style={styles.tagIcon}>🌐</Text>
            <Text style={styles.tagText}>Universal</Text>
          </View>
          <View style={styles.tagDot} />
          <View style={styles.tag}>
            <Text style={styles.tagIcon}>🔐</Text>
            <Text style={styles.tagText}>Private</Text>
          </View>
        </View>
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
    paddingTop: 50,
    paddingBottom: 40,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 28,
  },
  logoWrapper: {
    width: 92,
    height: 92,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  keyIcon: {
    fontSize: 46,
  },
  lockBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 34,
    height: 34,
    backgroundColor: '#f59e0b',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0a0a0a',
  },
  lockIcon: {
    fontSize: 18,
    color: '#fff',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 17,
    color: '#aaaaaa',
    marginBottom: 52,
  },
  featuresContainer: {
    width: '100%',
    gap: 14,
    marginBottom: 48,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#161616',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#242424',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16.5,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 14,
    color: '#aaaaaa',
    lineHeight: 19,
  },
  getStartedButton: {
    backgroundColor: '#ffffff',
    width: '100%',
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: '#000000',
    fontSize: 17.5,
    fontWeight: '700',
  },
  bottomTags: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tagIcon: {
    fontSize: 14,
  },
  tagText: {
    color: '#777777',
    fontSize: 13,
  },
  tagDot: {
    width: 3,
    height: 3,
    backgroundColor: '#444444',
    borderRadius: 1.5,
  },
});