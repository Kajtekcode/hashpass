// src/screens/SetupLoadingScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated,
  Easing 
} from 'react-native';
import { bitcoinService } from '../services/bitcoinService';

interface SetupLoadingScreenProps {
  seedPhrase: string;
  pin: string;
  onComplete: () => void;
}

export default function SetupLoadingScreen({ seedPhrase, pin, onComplete }: SetupLoadingScreenProps) {
  const [stage, setStage] = useState<'loading' | 'success'>('loading');
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    let isMounted = true;

    const startSetup = async () => {
      try {
        await bitcoinService.saveEncryptedMnemonic(seedPhrase, pin);
        console.log('✅ Mnemonic encrypted and saved');
      } catch (error) {
        console.error('Encryption failed:', error);
      }

      // Smooth progress animation
      Animated.timing(progress, {
        toValue: 100,
        duration: 1800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        if (isMounted) {
          setStage('success');
          setTimeout(() => {
            if (isMounted) onComplete();
          }, 1400);
        }
      });
    };

    startSetup();

    return () => {
      isMounted = false;
    };
  }, [seedPhrase, pin, onComplete, progress]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {stage === 'loading' ? (
          <>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🔑</Text>
            </View>

            <Text style={styles.title}>Setting up your wallet</Text>
            <Text style={styles.subtitle}>Encrypting your keys with military-grade security...</Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✅</Text>
            </View>

            <Text style={styles.successTitle}>Wallet Created Successfully!</Text>
            <Text style={styles.successSubtitle}>
              Your Bitcoin-powered keychain is now ready and secure.
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 90,
    height: 90,
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  icon: {
    fontSize: 42,
    color: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
    maxWidth: 300,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 280,
    marginBottom: 40,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#222222',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 999,
  },

  // Success Stage
  successIconContainer: {
    width: 110,
    height: 110,
    backgroundColor: '#1a1a1a',
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 4,
    borderColor: '#f59e0b',
  },
  successIcon: {
    fontSize: 52,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
});