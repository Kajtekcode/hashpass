// src/screens/QRScannerScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Alert, 
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView 
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { bitcoinService, sessionService } from '../services/bitcoinService';

interface QRScannerScreenProps {
  onClose: () => void;
}

interface ScannedData {
  site: string;
  challenge: string;
  register?: boolean;
}

export default function QRScannerScreen({ onClose }: QRScannerScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [stage, setStage] = useState<'scan' | 'confirm' | 'pinInput' | 'success' | 'error'>('scan');
  const [pin, setPin] = useState('');
  const [resultData, setResultData] = useState<{ publicKey?: string; signature?: string; message: string } | null>(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);

    try {
      const parsed = JSON.parse(data) as ScannedData;
      if (!parsed.site || !parsed.challenge) throw new Error('Invalid');
      setScannedData(parsed);
      setStage('confirm');
    } catch {
      Alert.alert('Invalid QR Code', 'Please scan a valid Hash Pass QR code.');
      onClose();
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 6 || !scannedData) {
      Alert.alert('Invalid PIN', 'Enter 6 digits');
      return;
    }

    setIsProcessing(true);
    setStage('success');

    try {
      let resultMessage = '';
      let publicKey: string | undefined;
      let signature: string | undefined;

      if (scannedData.register) {
        publicKey = await bitcoinService.getPerSitePublicKey(scannedData.site, pin);
        resultMessage = `Public key derived for ${scannedData.site}`;
      } else {
        signature = await bitcoinService.simulateBIP322Sign(scannedData.site, scannedData.challenge, pin);
        resultMessage = `Signature created for ${scannedData.site}`;
      }

      setResultData({ 
        publicKey, 
        signature, 
        message: resultMessage 
      });

      // Save to activity / registered sites
      const fingerprint = await bitcoinService.getAccountFingerprint(pin);
      const action = scannedData.register ? 'register' : 'login';
      await sessionService.addSession(fingerprint, scannedData.site, scannedData.challenge, action);

      console.log(`✅ ${action} session saved for ${scannedData.site}`);
    } catch (error: any) {
      console.error('QR processing error:', error);
      Alert.alert('Error', error.message || 'Failed to process request');
      setStage('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied!', `${label} copied.\n\nGo back to the website and paste it.`);
    } catch {
      Alert.alert('Copy failed', 'Please try again.');
    }
  };

  const handleClose = () => {
    setPin('');
    setScannedData(null);
    setResultData(null);
    setStage('scan');
    setScanned(false);
    onClose();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {stage === 'scan' && (
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
            <Text style={styles.instruction}>Scan QR Code</Text>
            <Text style={styles.subtitle}>Point at the demo website</Text>
            <Pressable style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </Pressable>
          </View>
        </>
      )}

      {stage === 'confirm' && scannedData && (
        <View style={styles.confirmContainer}>
          <View style={styles.siteIcon}>
            <Text style={styles.siteEmoji}>🌐</Text>
          </View>
          <Text style={styles.siteName}>{scannedData.site}</Text>
          <Text style={styles.authText}>
            {scannedData.register 
              ? 'wants to register your public key' 
              : 'wants to authenticate you'}
          </Text>
          <Pressable style={styles.confirmButton} onPress={() => setStage('pinInput')}>
            <Text style={styles.confirmButtonText}>Continue with PIN</Text>
          </Pressable>
          <Pressable style={styles.cancelTextButton} onPress={handleClose}>
            <Text style={styles.cancelSmallText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {stage === 'pinInput' && scannedData && (
        <View style={styles.pinContainer}>
          <Text style={styles.pinTitle}>Enter Your PIN</Text>
          <Text style={styles.pinSubtitle}>
            to confirm {scannedData.register ? 'registration' : 'login'} to {scannedData.site}
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
            autoFocus
          />
          <Pressable 
            style={styles.confirmButton} 
            onPress={handlePinSubmit} 
            disabled={isProcessing || pin.length !== 6}
          >
            {isProcessing ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.confirmButtonText}>
                {scannedData.register ? 'GENERATE PUBLIC KEY' : 'GENERATE SIGNATURE'}
              </Text>
            )}
          </Pressable>
          <Pressable style={styles.cancelTextButton} onPress={handleClose}>
            <Text style={styles.cancelSmallText}>Cancel</Text>
          </Pressable>
        </View>
      )}

      {stage === 'success' && resultData && scannedData && (
        <ScrollView contentContainerStyle={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>{scannedData.register ? '🔑' : '✅'}</Text>
          </View>
          <Text style={styles.successTitle}>
            {scannedData.register ? 'Registration Ready' : 'Signature Ready'}
          </Text>
          <Text style={styles.successSubtitle}>{resultData.message}</Text>

          {scannedData.register && resultData.publicKey && (
            <Pressable 
              style={styles.copyButton} 
              onPress={() => copyToClipboard(resultData.publicKey!, 'Public Key')}
            >
              <Text style={styles.copyButtonText}>Copy Public Key</Text>
            </Pressable>
          )}

          {!scannedData.register && resultData.signature && (
            <Pressable 
              style={styles.copyButton} 
              onPress={() => copyToClipboard(resultData.signature!, 'Signature')}
            >
              <Text style={styles.copyButtonText}>Copy Signature</Text>
            </Pressable>
          )}

          <Pressable style={styles.doneButton} onPress={handleClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </ScrollView>
      )}

      {stage === 'error' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Failed</Text>
          <Pressable style={styles.doneButton} onPress={handleClose}>
            <Text style={styles.doneButtonText}>Try Again</Text>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  qrFrame: { width: 280, height: 280, position: 'relative' },
  corner: { position: 'absolute', width: 50, height: 50, borderColor: '#fff', borderWidth: 4 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  instruction: { color: '#fff', fontSize: 20, fontWeight: '600', marginTop: 60 },
  subtitle: { color: '#aaa', fontSize: 15, marginTop: 8 },
  cancelButton: { position: 'absolute', bottom: 80, backgroundColor: '#333', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 30 },
  cancelText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  confirmContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  siteIcon: { width: 80, height: 80, backgroundColor: '#1f1f1f', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  siteEmoji: { fontSize: 42 },
  siteName: { fontSize: 26, color: '#fff', fontWeight: '700', marginBottom: 12 },
  authText: { fontSize: 17, color: '#aaa', textAlign: 'center', marginBottom: 60 },

  pinContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
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
    marginBottom: 50 
  },

  confirmButton: { 
    backgroundColor: '#f59e0b', 
    width: '100%', 
    paddingVertical: 18, 
    borderRadius: 16, 
    alignItems: 'center' 
  },
  confirmButtonText: { color: '#000', fontSize: 17, fontWeight: '700' },
  cancelTextButton: { marginTop: 30 },
  cancelSmallText: { color: '#888', fontSize: 15 },

  successContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, paddingBottom: 40 },
  successIconContainer: { 
    width: 100, 
    height: 100, 
    backgroundColor: '#1a1a1a', 
    borderRadius: 50, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 32, 
    borderWidth: 4, 
    borderColor: '#f59e0b' 
  },
  successIcon: { fontSize: 52 },
  successTitle: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 16, textAlign: 'center' },
  successSubtitle: { fontSize: 16, color: '#aaa', textAlign: 'center', marginBottom: 50 },

  copyButton: { 
    backgroundColor: '#1f1f1f', 
    width: '100%', 
    paddingVertical: 20, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginBottom: 30 
  },
  copyButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },

  doneButton: { 
    backgroundColor: '#f59e0b', 
    width: '100%', 
    paddingVertical: 18, 
    borderRadius: 16, 
    alignItems: 'center' 
  },
  doneButtonText: { color: '#000', fontSize: 17, fontWeight: '700' },

  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorIcon: { fontSize: 60, marginBottom: 20 },
  errorTitle: { fontSize: 24, color: '#fff', fontWeight: '700', marginBottom: 12 },
});