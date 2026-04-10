// App.tsx
import React, { useState, useEffect } from 'react';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import WelcomeScreen from './src/screens/WelcomeScreen';
import EducationalScreen from './src/screens/EducationalScreen';
import CreateWalletScreen from './src/screens/CreateWalletScreen';
import SeedPhraseScreen from './src/screens/SeedPhraseScreen';
import VerifyRecoveryScreen from './src/screens/VerifyRecoveryScreen';
import ImportWalletScreen from './src/screens/ImportWalletScreen';
import PINSetupScreen from './src/screens/PINSetupScreen';
import SetupLoadingScreen from './src/screens/SetupLoadingScreen';
import BiometricsSetupScreen from './src/screens/BiometricsSetupScreen';
import UnlockScreen from './src/screens/UnlockScreen';
import HomeScreen from './src/screens/HomeScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import RegisteredSitesScreen from './src/screens/RegisteredSitesScreen';
import ActivityScreen from './src/screens/ActivityScreen';

import * as SecureStore from 'expo-secure-store';

const ONBOARDING_COMPLETED_KEY = 'hashpass_onboarding_completed';

export default function App() {
  const [screen, setScreen] = useState<
    'welcome' | 'educational' | 'createWallet' | 'seedPhrase' | 'verifyRecovery' |
    'importWallet' | 'pinSetup' | 'setupLoading' | 'biometricsSetup' | 'unlock' | 'home' | 
    'qrScanner' | 'settings' | 'registeredSites' | 'activity'
  >('welcome');

  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [currentPin, setCurrentPin] = useState<string>('');

  // Check if user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const completed = await SecureStore.getItemAsync(ONBOARDING_COMPLETED_KEY);
      if (completed === 'true') {
        setScreen('unlock');
      } else {
        setScreen('welcome');
      }
    };
    checkOnboardingStatus();
  }, []);

  // Navigation handlers
  const handleGetStarted = () => setScreen('educational');
  const handleContinueToCreateWallet = () => setScreen('createWallet');

  const handleNewWallet = () => setScreen('seedPhrase');
  const handleImportWallet = () => setScreen('importWallet');

  const handleSeedContinue = (generatedSeed: string) => {
    setSeedPhrase(generatedSeed);
    setScreen('verifyRecovery');
  };

  const handleVerifySuccess = () => setScreen('pinSetup');

  const handleImportContinue = (importedMnemonic: string) => {
    setSeedPhrase(importedMnemonic);
    setScreen('pinSetup');
  };

  const handlePINComplete = (pin: string) => {
    setCurrentPin(pin);
    setScreen('setupLoading');
  };

  const handleLoadingComplete = () => setScreen('biometricsSetup');

  const handleBiometricsComplete = async () => {
    await SecureStore.setItemAsync(ONBOARDING_COMPLETED_KEY, 'true');
    setScreen('home');
  };

  const handleBiometricsSkip = async () => {
    await SecureStore.setItemAsync(ONBOARDING_COMPLETED_KEY, 'true');
    setScreen('home');
  };

  const handleUnlockSuccess = () => setScreen('home');

  const goToHome = () => setScreen('home');
  const goToQRScanner = () => setScreen('qrScanner');
  const goToSettings = () => setScreen('settings');
  const goToRegisteredSites = () => setScreen('registeredSites');
  const goToActivity = () => setScreen('activity');

  return (
    <>
      {screen === 'welcome' && <WelcomeScreen onGetStarted={handleGetStarted} />}
      
      {screen === 'educational' && <EducationalScreen onContinue={handleContinueToCreateWallet} />}

      {screen === 'createWallet' && (
        <CreateWalletScreen 
          onNewWallet={handleNewWallet}
          onImportWallet={handleImportWallet}
          onBack={() => setScreen('educational')}
        />
      )}

      {screen === 'seedPhrase' && (
        <SeedPhraseScreen 
          onBack={() => setScreen('createWallet')} 
          onContinue={handleSeedContinue} 
        />
      )}

      {screen === 'verifyRecovery' && (
        <VerifyRecoveryScreen 
          seedPhrase={seedPhrase}
          onBack={() => setScreen('seedPhrase')}
          onContinue={handleVerifySuccess}
        />
      )}

      {screen === 'importWallet' && (
        <ImportWalletScreen 
          onBack={() => setScreen('createWallet')} 
          onContinue={handleImportContinue} 
        />
      )}

      {screen === 'pinSetup' && (
        <PINSetupScreen
          seedPhrase={seedPhrase}
          onComplete={handlePINComplete}
          onBack={() => setScreen('createWallet')}
        />
      )}

      {screen === 'setupLoading' && (
        <SetupLoadingScreen 
          seedPhrase={seedPhrase}
          pin={currentPin}
          onComplete={handleLoadingComplete}
        />
      )}

      {screen === 'biometricsSetup' && (
        <BiometricsSetupScreen
          onComplete={handleBiometricsComplete}
          onSkip={handleBiometricsSkip}
        />
      )}

      {screen === 'unlock' && <UnlockScreen onUnlockSuccess={handleUnlockSuccess} />}

      {screen === 'home' && (
        <HomeScreen 
          onScanQR={goToQRScanner}
          onSettings={goToSettings}
          onActivity={goToActivity}
          onRegisteredSites={goToRegisteredSites}
          currentPin={currentPin}
        />
      )}

      {screen === 'qrScanner' && <QRScannerScreen onClose={goToHome} />}

      {screen === 'settings' && <SettingsScreen onBack={goToHome} />}

      {/* Fixed rendering with currentPin */}
      {screen === 'registeredSites' && (
        <RegisteredSitesScreen 
          onBack={goToHome} 
          currentPin={currentPin} 
        />
      )}

      {screen === 'activity' && <ActivityScreen onBack={goToHome} />}
    </>
  );
}