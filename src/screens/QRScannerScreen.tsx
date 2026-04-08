// src/screens/QRScannerScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ActivityIndicator, 
  TextInput,
  Alert
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { bitcoinService } from '../services/bitcoinService';

interface QRScannerScreenProps {
  onClose: () => void;
  onScanSuccess: (site: string) => void;
  onInvalidQR: () => void;   // Will be called from HomeScreen
}

export default function QRScannerScreen({ onClose, onScanSuccess, onInvalidQR }: QRScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedData, setScannedData] = useState<{ site: string; challenge: string } | null>(null);
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
      if (!parsed.site || !parsed.challenge) {
        throw new Error('Invalid format');
      }
      setScannedData(parsed);
    } catch {
      onInvalidQR();   // Tell HomeScreen to show alert
      onClose();       // Immediately close scanner
    }
  };

  const handleConfirmLogin = () => {
    if (!scannedData) return;
    setShowPinInput(true);
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 6) {
      Alert.alert('Invalid PIN', 'Please enter your 6-digit PIN.');
      return;
    }
    if (!scannedData) return;

    setIsProcessing(true);

    try {
      await bitcoinService.simulateBIP322Sign(scannedData.site, scannedData.challenge, pin);
      onScanSuccess(scannedData.site);
    } catch (error) {
      Alert.alert('Authentication Failed', 'Invalid PIN or signing error.');
      setPin('');
    } finally {
      setIsProcessing(false);
      onClose();
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

            <Text style={styles.instruction}>Position QR code within the frame</Text>
            <Text style={styles.scanningText}>SCANNING FOR QR CODE...</Text>

            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </Pressable>
          </View>
        </>
      ) : showPinInput ? (
        <View style={styles.pinContainer}>
          <Text style={styles.pinTitle}>Enter Your PIN</Text>
          <Text style={styles.pinSubtitle}>to confirm login to {scannedData.site}</Text>

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

          <Pressable style={styles.confirmButton} onPress={handlePinSubmit} disabled={isProcessing}>
            {isProcessing ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.confirmButtonText}>CONFIRM LOGIN</Text>
            )}
          </Pressable>

          <Pressable style={styles.cancelTextButton} onPress={handleClose}>
            <Text style={styles.cancelSmallText}>CANCEL</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmTitle}>Login Request</Text>
          <Text style={styles.siteName}>{scannedData.site}</Text>

          <Pressable 
            style={styles.confirmButton} 
            onPress={handleConfirmLogin}
          >
            <Text style={styles.confirmButtonText}>ENTER PIN TO LOGIN</Text>
          </Pressable>

          <Pressable style={styles.cancelTextButton} onPress={handleClose}>
            <Text style={styles.cancelSmallText}>CANCEL REQUEST</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a', padding: 40 },
  text: { color: '#fff', fontSize: 18 },
  button: { marginTop: 30, paddingVertical: 16, paddingHorizontal: 40, backgroundColor: '#f59e0b', borderRadius: 12 },
  buttonText: { color: '#000', fontWeight: '700', fontSize: 16 },

  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  qrFrame: { width: 280, height: 280, position: 'relative' },
  corner: { position: 'absolute', width: 50, height: 50, borderColor: '#f59e0b', borderWidth: 5 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  instruction: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: 50 },
  scanningText: { color: '#f59e0b', fontSize: 14, marginTop: 12 },

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
  confirmTitle: { fontSize: 26, color: '#f59e0b', fontWeight: '700', marginBottom: 8 },
  siteName: { fontSize: 32, color: '#f59e0b', fontWeight: '700', marginBottom: 60 },

  pinContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  pinTitle: { fontSize: 24, color: '#fff', marginBottom: 8 },
  pinSubtitle: { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 40 },
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