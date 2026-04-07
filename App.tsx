import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import WelcomeScreen from './src/screens/WelcomeScreen';
import EducationalScreen from './src/screens/EducationalScreen';
import SeedPhraseScreen from './src/screens/SeedPhraseScreen';
import KeyDisplayScreen from './src/screens/KeyDisplayScreen';

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'educational' | 'seedPhrase' | 'keyDisplay'>('welcome');
  const [seedPhrase, setSeedPhrase] = useState<string>('');

  const handleGetStarted = () => setScreen('educational');

  const handleContinueToSeed = () => setScreen('seedPhrase');

  const handleSeedContinue = (generatedSeed: string) => {
    setSeedPhrase(generatedSeed);
    setScreen('keyDisplay');
  };

  const handleKeyDisplayDone = () => {
    Alert.alert('All Set!', 'Your Bitcoin key is ready for passwordless login.');
    setScreen('welcome'); // or onboarding if you want
  };

  return (
    <>
      {screen === 'welcome' && <WelcomeScreen onGetStarted={handleGetStarted} />}
      
      {screen === 'educational' && (
        <EducationalScreen onContinue={handleContinueToSeed} />
      )}

      {screen === 'seedPhrase' && (
        <SeedPhraseScreen
          onBack={() => setScreen('educational')}
          onContinue={handleSeedContinue}
        />
      )}

      {screen === 'keyDisplay' && (
        <KeyDisplayScreen
          seedPhrase={seedPhrase}
          onBack={() => setScreen('educational')}
          onDone={handleKeyDisplayDone}
        />
      )}
    </>
  );
}