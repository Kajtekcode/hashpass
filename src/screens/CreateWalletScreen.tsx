// src/screens/CreateWalletScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  SafeAreaView 
} from 'react-native';
import { SafeAreaView as SafeAreaContext } from 'react-native-safe-area-context';

interface CreateWalletScreenProps {
  onNewWallet: () => void;
  onImportWallet: () => void;
  onBack: () => void;
}

export default function CreateWalletScreen({ 
  onNewWallet, 
  onImportWallet, 
  onBack 
}: CreateWalletScreenProps) {
  return (
    <SafeAreaContext style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Create Wallet</Text>

        <View style={styles.optionsContainer}>
          {/* New Wallet Option */}
          <Pressable style={styles.optionCard} onPress={onNewWallet}>
            <View style={styles.optionIcon}>
              <Text style={styles.optionIconText}>+</Text>
            </View>
            <Text style={styles.optionTitle}>New</Text>
            <Text style={styles.optionSubtitle}>Create a fresh wallet</Text>
          </Pressable>

          {/* Import Wallet Option */}
          <Pressable style={styles.optionCard} onPress={onImportWallet}>
            <View style={styles.optionIcon}>
              <Text style={styles.optionIconText}>↓</Text>
            </View>
            <Text style={styles.optionTitle}>Import</Text>
            <Text style={styles.optionSubtitle}>Import existing wallet</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaContext>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  backText: {
    color: '#f59e0b',
    fontSize: 17,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 60,
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 16,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingVertical: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  optionIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  optionIconText: {
    fontSize: 32,
    color: '#ffffff',
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#aaaaaa',
    textAlign: 'center',
  },
});