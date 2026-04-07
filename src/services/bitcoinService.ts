import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';

const bip32 = BIP32Factory(ecc);

export interface DerivedKeys {
  privateKey: string;
  publicKey: string;
  address: string;
  path: string;
}

export const bitcoinService = {
  async mnemonicToSeed(mnemonic: string): Promise<Buffer> {
    return await bip39.mnemonicToSeed(mnemonic);
  },

  async deriveKeys(mnemonic: string): Promise<DerivedKeys> {
    try {
      const seed = await this.mnemonicToSeed(mnemonic);
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

      if (!address) {
        throw new Error('Failed to generate address');
      }

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
};