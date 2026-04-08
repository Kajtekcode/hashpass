// App.tsx
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import WelcomeScreen from './src/screens/WelcomeScreen';
import EducationalScreen from './src/screens/EducationalScreen';
import SeedPhraseScreen from './src/screens/SeedPhraseScreen';
import KeyDisplayScreen from './src/screens/KeyDisplayScreen';
import PINSetupScreen from './src/screens/PINSetupScreen';
import BiometricsSetupScreen from './src/screens/BiometricsSetupScreen';
import HomeScreen from './src/screens/HomeScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export default function App() {
  const [screen, setScreen] = useState<
    'welcome' | 'educational' | 'seedPhrase' | 'keyDisplay' | 'pinSetup' | 'biometricsSetup' | 'home' | 'qrScanner' | 'settings'
  >('welcome');

  const [seedPhrase, setSeedPhrase] = useState<string>(''); // Temporary storage until encrypted

  const handleGetStarted = () => setScreen('educational');

  const handleContinueToSeed = () => setScreen('seedPhrase');
  
    const handleSeedContinue = (generatedSeed: string) => {
    setSeedPhrase(generatedSeed);
    setScreen('keyDisplay');
  };

  const handleKeyDisplayDone = () => setScreen('pinSetup');

  const handlePINComplete = () => {
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

      {screen === 'keyDisplay' && (
        <KeyDisplayScreen
          onBack={handleBack}
          onDone={handleKeyDisplayDone}
        />
      )}

      {screen === 'pinSetup' && (
        <PINSetupScreen
          seedPhrase={seedPhrase}
          onComplete={handlePINComplete}
          onBack={handleKeyDisplayDone}
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
          onClose={() => setScreen('home')}
          onScanSuccess={(site) => {
            // handle successful login
            setScreen('home');
          }}
          onInvalidQR={() => {
            setTimeout(() => {
              Alert.alert('Invalid QR Code', 'Please scan a valid Hash Pass login QR code.');
            }, 300);   // Small delay to let the screen fully return to Home
          }}
        />
      )}

      {screen === 'settings' && <SettingsScreen onBack={goToHome} />}
    </>
  );
}