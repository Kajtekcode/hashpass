import React, { useState } from 'react';
import { Alert } from 'react-native';

import WelcomeScreen from './src/screens/WelcomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

export default function App() {
  const [screen, setScreen] = useState<'welcome' | 'onboarding'>('welcome');

  const handleGetStarted = () => {
    setScreen('onboarding');
  };

  const handleStrongSecurity = () => {
    Alert.alert('Strong Security', 'Seed phrase screen coming soon ✨');
    // Later we will navigate to the seed-phrase generation screen
  };

  const handleNormalSecurity = () => {
    Alert.alert('Normal Security', 'Easy recovery screen coming soon ✨');
    // Later we will navigate to the short-code flow
  };

  return (
    <>
      {screen === 'welcome' && (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      )}

      {screen === 'onboarding' && (
        <OnboardingScreen
          onChooseStrong={handleStrongSecurity}
          onChooseNormal={handleNormalSecurity}
        />
      )}
    </>
  );
}