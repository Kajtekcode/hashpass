# Hash Pass

A simple **Bitcoin-powered passwordless login** app built with Expo and React Native.

## Vision
Users scan a QR code on any website → confirm with biometrics → instantly logged in.

All Bitcoin complexity (HD key derivation with BIP32, BIP322 signing, etc.) runs silently in the background.

## Current Features
- Clean, professional folder structure (`src/screens/` + `src/components/`)
- Welcome screen
- Onboarding screen with two security levels:
  - **Strong Security** (12-word seed phrase — Bitcoin standard)
  - **Normal Security** (easy recovery with short code)
- Fully typed with TypeScript
- State-based screen navigation (classic Expo setup)

## Tech Stack
- React Native + Expo (TypeScript)
- Bitcoin-related logic (coming soon: `bip39`, `bitcoinjs-lib`, etc.)
- Clean architecture with separated screens and reusable components

## How to Run

1. Clone the repo:
   ```bash
   git clone https://github.com/Kajtekcode/hashpass.git
   cd hashpass