// src/screens/SetupLoadingScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { bitcoinService } from '../services/bitcoinService';

interface SetupLoadingScreenProps {
  seedPhrase: string;
  pin: string;
  onComplete: () => void;
}

export default function SetupLoadingScreen({ seedPhrase, pin, onComplete }: SetupLoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const startSetup = async () => {
      try {
        // Encrypt during the loading animation
        await bitcoinService.saveEncryptedMnemonic(seedPhrase, pin);
        console.log('✅ Seed phrase encrypted and saved during loading');
      } catch (error) {
        console.error('Encryption failed:', error);
        if (isMounted) {
          Alert.alert('Error', 'Failed to save your recovery phrase.');
        }
      }

      // Animate progress bar
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            if (isMounted) {
              setTimeout(onComplete, 600);
            }
            return 100;
          }
          return prev + 4;
        });
      }, 35);
    };

    startSetup();

    return () => {
      isMounted = false;
    };
  }, [seedPhrase, pin, onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.keyIcon}>🔑</Text>
        </View>

        <Text style={styles.title}>Setting up</Text>
        <Text style={styles.subtitle}>Creating your secure keychain</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        </View>

        <ActivityIndicator size="small" color="#666666" style={styles.spinner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 78,
    height: 78,
    backgroundColor: '#1a1a1a',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  keyIcon: {
    fontSize: 38,
    color: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    marginBottom: 60,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 40,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#222222',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 999,
  },
  spinner: {
    marginTop: 20,
  },
});