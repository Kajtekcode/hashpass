// src/screens/QRScannerScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Alert, 
  ActivityIndicator,
  TextInput 
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import * as LocalAuthentication from 'expo-local-authentication';
import { bitcoinService, sessionService } from '../services/bitcoinService';
import { settingsService } from '../services/bitcoinService';

interface QRScannerScreenProps {
  onClose: () => void;
  onScanSuccess: (site: string) => void;
  onInvalidQR: () => void;
}

export default function QRScannerScreen({ onClose, onScanSuccess, onInvalidQR }: QRScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedData, setScannedData] = useState<{ 
    site: string; 
    challenge: string; 
    register?: boolean 
  } | null>(null);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);

    try {
      const parsed = JSON.parse(data);
      if (!parsed.site || !parsed.challenge) throw new Error('Invalid');
      setScannedData(parsed);
    } catch {
      Alert.alert('Invalid QR Code', 'Please scan a valid Hash Pass QR code.');
      onInvalidQR();
      onClose();
    }
  };

  const tryBiometrics = async () => {
    if (!scannedData) return;

    const isBiometricsEnabled = await settingsService.getBiometricsEnabled();

    if (!isBiometricsEnabled) {
      setShowPinInput(true);
      return;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Confirm ${scannedData.register ? 'registration' : 'login'} to ${scannedData.site}`,
        fallbackLabel: 'Use PIN',
      });

      setShowPinInput(true);
    } catch (error) {
      setShowPinInput(true);
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 6 || !scannedData) {
      Alert.alert('Invalid PIN', 'Please enter your 6-digit PIN.');
      return;
    }

    setIsProcessing(true);

    try {
      const baseUrl = "https://kajtekcode.github.io/hashpass-demo/";

      if (scannedData.register) {
        // Register mode
        const publicKey = await bitcoinService.getPublicKey(pin);
        
        Alert.alert(
          'Registration Successful',
          'Your public key has been registered.\n\nYou can now log in with this account.',
          [{ text: 'OK', onPress: () => onClose() }]
        );
      } else {
        // Login mode
        await bitcoinService.simulateBIP322Sign(
          scannedData.site, 
          scannedData.challenge, 
          pin
        );

        await sessionService.addSession(scannedData.site, scannedData.challenge);

        Alert.alert(
          'Login Successful',
          `You have been authenticated for ${scannedData.site}`,
          [{ text: 'OK', onPress: () => onClose() }]
        );
      }

      onScanSuccess(scannedData.site);
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Failed', error.message || 'Invalid PIN or cryptographic error.');
      setPin('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => onClose();

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Camera permission is required.</Text>
        <Pressable style={styles.button} onPress={handleClose}>
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!scannedData ? (
        // Scanning View
        <>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />

          <View style={styles.overlay}>
            <View style={styles.qrFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            <Text style={styles.instruction}>Scan to login</Text>
            <Text style={styles.subtitle}>Point camera at QR code</Text>

            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </Pressable>
          </View>
        </>
      ) : showPinInput ? (
        // PIN Input
        <View style={styles.pinContainer}>
          <Text style={styles.pinTitle}>
            {scannedData.register ? 'Register Account' : 'Enter Your PIN'}
          </Text>
          <Text style={styles.pinSubtitle}>
            {scannedData.register 
              ? 'to register your public key' 
              : `to confirm login to ${scannedData.site}`}
          </Text>

          <TextInput
            style={styles.pinInput}
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            maxLength={6}
            secureTextEntry
            placeholder="••••••"
            placeholderTextColor="#555"
          />

          <Pressable 
            style={[styles.confirmButton, isProcessing && { opacity: 0.7 }]} 
            onPress={handlePinSubmit} 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.confirmButtonText}>
                {scannedData.register ? 'REGISTER PUBLIC KEY' : 'CONFIRM LOGIN'}
              </Text>
            )}
          </Pressable>

          <Pressable style={styles.cancelTextButton} onPress={handleClose}>
            <Text style={styles.cancelSmallText}>CANCEL</Text>
          </Pressable>
        </View>
      ) : (
        // Confirmation Screen
        <View style={styles.confirmContainer}>
          <View style={styles.siteIcon}>
            <Text style={styles.siteEmoji}>🔶</Text>
          </View>

          <Text style={styles.siteName}>{scannedData.site}</Text>
          <Text style={styles.authText}>
            {scannedData.register ? 'wants to register your public key' : 'wants to authenticate you'}
          </Text>

          <Pressable style={styles.biometricsButton} onPress={tryBiometrics}>
            <View style={styles.fingerprintContainer}>
              <Text style={styles.fingerprintIcon}>👆</Text>
            </View>
            <Text style={styles.biometricsText}>
              {scannedData.register ? 'Continue Registration' : 'Confirm with biometrics'}
            </Text>
          </Pressable>

          <Pressable style={styles.cancelTextButton} onPress={handleClose}>
            <Text style={styles.cancelSmallText}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },

  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0a0a0a',
    padding: 40 
  },
  text: { color: '#fff', fontSize: 18 },

  button: { 
    marginTop: 30, 
    paddingVertical: 16, 
    paddingHorizontal: 40, 
    backgroundColor: '#f59e0b', 
    borderRadius: 12 
  },
  buttonText: { 
    color: '#000', 
    fontWeight: '700', 
    fontSize: 16 
  },

  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  qrFrame: { width: 280, height: 280, position: 'relative' },
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderColor: '#ffffff',
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  instruction: { color: '#ffffff', fontSize: 20, fontWeight: '600', marginTop: 60 },
  subtitle: { color: '#aaaaaa', fontSize: 15, marginTop: 8 },

  cancelButton: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: '#333',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
  },
  cancelText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  confirmContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  siteIcon: {
    width: 72,
    height: 72,
    backgroundColor: '#1f1f1f',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  siteEmoji: { fontSize: 36 },
  siteName: { fontSize: 28, color: '#ffffff', fontWeight: '700', marginBottom: 8 },
  authText: { fontSize: 16, color: '#aaaaaa', marginBottom: 80 },

  biometricsButton: {
    backgroundColor: '#1f1f1f',
    width: '100%',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  fingerprintContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#2a2a2a',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  fingerprintIcon: { fontSize: 32 },
  biometricsText: { color: '#ffffff', fontSize: 17, fontWeight: '600' },

  pinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  pinTitle: { fontSize: 24, color: '#ffffff', marginBottom: 8 },
  pinSubtitle: { fontSize: 16, color: '#aaaaaa', textAlign: 'center', marginBottom: 40 },
  pinInput: {
    backgroundColor: '#161616',
    color: '#fff',
    fontSize: 36,
    letterSpacing: 16,
    paddingVertical: 20,
    borderRadius: 14,
    width: 220,
    textAlign: 'center',
    marginBottom: 50,
  },
  confirmButton: {
    backgroundColor: '#f59e0b',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmButtonText: { color: '#000', fontSize: 17, fontWeight: '700' },

  cancelTextButton: { marginTop: 30 },
  cancelSmallText: { color: '#888', fontSize: 15 },
});