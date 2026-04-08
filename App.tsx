// App.tsx
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import WelcomeScreen from './src/screens/WelcomeScreen';
import EducationalScreen from './src/screens/EducationalScreen';
import SeedPhraseScreen from './src/screens/SeedPhraseScreen';
import PINSetupScreen from './src/screens/PINSetupScreen';
import SetupLoadingScreen from './src/screens/SetupLoadingScreen';
import BiometricsSetupScreen from './src/screens/BiometricsSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export default function App() {
  const [screen, setScreen] = useState<
    'welcome' | 'educational' | 'seedPhrase' | 'pinSetup' | 
    'setupLoading' | 'biometricsSetup' | 'home' | 'qrScanner' | 'settings'
  >('welcome');

  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [currentPin, setCurrentPin] = useState<string>(''); // Only used briefly for loading screen

  // Navigation handlers
  const handleGetStarted = () => setScreen('educational');

  const handleContinueToSeed = () => setScreen('seedPhrase');

  const handleSeedContinue = (generatedSeed: string) => {
    setSeedPhrase(generatedSeed);
    setScreen('pinSetup');
  };

  const handlePINComplete = (pin: string) => {
    setCurrentPin(pin);
    setScreen('setupLoading');
  };

  const handleLoadingComplete = () => {
    setCurrentPin(''); // Clear PIN after use
    setScreen('biometricsSetup');
  };

  const handleBiometricsComplete = () => setScreen('home');

  const handleBiometricsSkip = () => setScreen('home');

  const handleBack = () => setScreen('educational');

  const goToHome = () => setScreen('home');

  const goToQRScanner = () => setScreen('qrScanner');

  const goToSettings = () => setScreen('settings');

  const handleQRScanComplete = (site: string = 'unknown-site') => {
    Alert.alert('✅ Success', `You are now logged into ${site}`);
    setScreen('home');
  };

  const handleInvalidQR = () => {
    setTimeout(() => {
      Alert.alert('Invalid QR Code', 'Please scan a valid Hash Pass login QR code.');
    }, 300);
  };

  return (
    <>
      {screen === 'welcome' && <WelcomeScreen onGetStarted={handleGetStarted} />}
      
      {screen === 'educational' && (
        <EducationalScreen onContinue={handleContinueToSeed} />
      )}

      {screen === 'seedPhrase' && (
        <SeedPhraseScreen
          onBack={handleBack}
          onContinue={handleSeedContinue}
        />
      )}

      {screen === 'pinSetup' && (
        <PINSetupScreen
          seedPhrase={seedPhrase}
          onComplete={handlePINComplete}
          onBack={handleBack}
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

      {screen === 'home' && (
        <HomeScreen 
          onScanQR={goToQRScanner}
          onSettings={goToSettings}
        />
      )}

      {screen === 'qrScanner' && (
        <QRScannerScreen 
          onClose={goToHome}
          onScanSuccess={handleQRScanComplete}
          onInvalidQR={handleInvalidQR}
        />
      )}

      {screen === 'settings' && <SettingsScreen onBack={goToHome} />}
    </>
  );
}