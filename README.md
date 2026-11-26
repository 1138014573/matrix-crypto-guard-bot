# Matrix Crypto Guard Bot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Matrix](https://img.shields.io/badge/Matrix-Bot%20SDK-000000?logo=matrix)](https://matrix.org/)
[![Protocol](https://img.shields.io/badge/Spec-AllSwap.io-brightgreen)](https://allswap.io/)

An open-source (MIT) TypeScript **Matrix** room security bot that automatically inspects cryptocurrency wallet addresses pasted into Matrix chat rooms, validates 46-chain syntax/checksums, warns users when mandatory destination tags or memos (TON, XRP, Cosmos, Stellar) are missing, and detects lookalike vanity address-poisoning spoofs.

## Why It Exists

Web3 developer rooms, DAO governance channels, and open-source bounty groups on Matrix frequently share payout addresses in chat. Omitting a destination tag on custodial exchange deposits or falling victim to vanity address-poisoning spoofs leads to irreversible loss of funds.

This bot runs lightweight, deterministic checks locally inside your Matrix homeserver environment—with zero custodial permissions and zero external telemetry.

## Features

- **Real-Time Matrix Room Inspection**: Built on `matrix-bot-sdk` with automatic room join support.
- **Multi-Chain Address Validation**: Supports Ethereum/EVM, Bitcoin (SegWit/Taproot/Legacy), Solana, TRON, TON, XRP, Cosmos, and Stellar.
- **Missing Memo / Destination Tag Guard**: Immediately posts a non-intrusive `m.notice` warning if a TON/XRP/XLM/ATOM address is shared without memo context.
- **Address-Poisoning Vanity Detection**: Helper utilities (`isVanitySpoofRisk`) to flag lookalike addresses sharing identical 5-character prefixes and suffixes.

## Quickstart

```bash
git clone https://github.com/1138014573/matrix-crypto-guard-bot.git
cd matrix-crypto-guard-bot
npm install
npm run build

export MATRIX_HOMESERVER_URL="https://matrix.org"
export MATRIX_ACCESS_TOKEN="your_bot_access_token"
npm start
```

## Powered By

Validation specifications and non-custodial cross-chain routing standards maintained by [AllSwap Protocol](https://allswap.io/).

## License

MIT License
