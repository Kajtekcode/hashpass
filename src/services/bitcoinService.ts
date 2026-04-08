// src/services/bitcoinService.ts
import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Buffer } from 'buffer';

const bip32 = BIP32Factory(ecc);

const MNEMONIC_KEY = 'hashpass_encrypted_mnemonic';

export interface DerivedKeys {
  privateKey: string;
  publicKey: string;
  address: string;
  path: string;
}

// Helper to derive encryption key from PIN
async function deriveKeyFromPIN(pin: string): Promise<Buffer> {
  const salt = 'hashpass-salt-v1';
  let key = pin + salt;

  // Strong key stretching with 100,000 iterations
  for (let i = 0; i < 100000; i++) {
    key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      key
    );
  }

  return Buffer.from(key, 'hex');
}

export const bitcoinService = {
  async saveEncryptedMnemonic(mnemonic: string, pin: string): Promise<void> {
    try {
      const encryptionKey = await deriveKeyFromPIN(pin);
      const mnemonicBuffer = Buffer.from(mnemonic);
      const encrypted = Buffer.from(
        mnemonicBuffer.map((byte, i) => byte ^ encryptionKey[i % encryptionKey.length])
      );

      await SecureStore.setItemAsync(MNEMONIC_KEY, encrypted.toString('base64'));
      console.log('✅ Mnemonic encrypted and saved securely');
    } catch (error) {
      console.error('Failed to save encrypted mnemonic:', error);
      throw new Error('Failed to save recovery phrase');
    }
  },

  async getDecryptedMnemonic(pin: string): Promise<string> {
    try {
      const encryptedBase64 = await SecureStore.getItemAsync(MNEMONIC_KEY);
      if (!encryptedBase64) {
        throw new Error('No mnemonic found. Please reset the app.');
      }

      const encryptionKey = await deriveKeyFromPIN(pin);
      const encrypted = Buffer.from(encryptedBase64, 'base64');

      const decrypted = Buffer.from(
        encrypted.map((byte, i) => byte ^ encryptionKey[i % encryptionKey.length])
      );

      const mnemonic = decrypted.toString();
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid PIN or corrupted data');
      }

      return mnemonic;
    } catch (error) {
      console.error('Failed to decrypt mnemonic:', error);
      throw new Error('Invalid PIN or failed to retrieve recovery phrase');
    }
  },

  async deriveKeys(mnemonic: string): Promise<DerivedKeys> {
    try {
      const seed = await bip39.mnemonicToSeed(mnemonic);
      const master = bip32.fromSeed(seed);

      const path = "m/84'/0'/0'/0/0";
      const child = master.derivePath(path);

      if (!child.privateKey || !child.publicKey) {
        throw new Error('Failed to derive keys');
      }

      const privateKeyHex = Buffer.from(child.privateKey).toString('hex');
      const publicKeyHex = Buffer.from(child.publicKey).toString('hex');

      const { address } = bitcoin.payments.p2wpkh({
        pubkey: Buffer.from(child.publicKey),
        network: bitcoin.networks.bitcoin,
      });

      if (!address) throw new Error('Failed to generate address');

      return {
        privateKey: privateKeyHex,
        publicKey: publicKeyHex,
        address,
        path,
      };
    } catch (error) {
      console.error('Key derivation error:', error);
      throw new Error('Failed to derive Bitcoin keys');
    }
  },

  async derivePerSitePrivateKey(mnemonic: string, site: string): Promise<Buffer> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const master = bip32.fromSeed(seed);

    const siteHashHex = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      site.toLowerCase()
    );
    const index = parseInt(siteHashHex.slice(0, 8), 16) % 0x80000000;

    const child = master.derivePath(`m/0'/${index}'`);

    if (!child.privateKey) {
      throw new Error('Failed to derive per-site private key');
    }

    return Buffer.from(child.privateKey);
  },

  async simulateBIP322Sign(site: string, challenge: string, pin: string): Promise<string> {
    const mnemonic = await this.getDecryptedMnemonic(pin);
    const privKey = await this.derivePerSitePrivateKey(mnemonic, site);

    const challengeHashHex = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      challenge
    );
    const messageHash = Buffer.from(challengeHashHex, 'hex');

    const signature = ecc.sign(messageHash, privKey);
    const signatureBase64 = Buffer.from(signature).toString('base64');

    console.log(`✅ BIP322 signature created for ${site}`);
    return signatureBase64;
  },
};

// Session Management
interface Session {
  site: string;
  timestamp: Date;
  challenge: string;
}

let activeSessions: Session[] = [];

export const sessionService = {
  addSession(site: string, challenge: string) {
    activeSessions.unshift({ site, timestamp: new Date(), challenge });
    if (activeSessions.length > 5) activeSessions.pop();
  },
  getSessions(): Session[] {
    return [...activeSessions];
  },
  clearSessions() {
    activeSessions = [];
  },
};

// Settings
const BIOMETRICS_ENABLED_KEY = 'hashpass_biometrics_enabled';

export const settingsService = {
  async setBiometricsEnabled(enabled: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(BIOMETRICS_ENABLED_KEY, enabled.toString());
    } catch (error) {
      console.error('Failed to save biometrics setting:', error);
    }
  },

  async getBiometricsEnabled(): Promise<boolean> {
    try {
      const value = await SecureStore.getItemAsync(BIOMETRICS_ENABLED_KEY);
      return value === 'true';
    } catch (error) {
      return true;
    }
  },
};