## Accounts

### Master

: solana-keygen new -o tutorial-0.json
Generating a new keypair

For added security, enter a BIP39 passphrase

NOTE! This passphrase improves security of the recovery seed phrase NOT the
keypair file itself, which is stored as insecure plain text

BIP39 Passphrase (empty for none):

# Wrote new keypair to tutorial-0.json

# pubkey: BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y

Save this seed phrase and your BIP39 passphrase to recover your new keypair:
multiply volcano napkin aim damage field limit blood night one letter season
============================================================================

### Lending Market Account

- Pub: CpzbsUspoQ7LiJ2sKSmKnAWgTe9y1YgGzoSnQdd37o45
- Secret: [14,13,32,82,52,52,57,214,230,191,39,143,181,131,95,101,193,70,131,21,0,62,66,35,15,29,234,119,231,29,137,34,175,187,251,239,0,45,40,76,21,47,167,59,226,197,50,209,126,32,108,66,62,203,144,85,124,252,36,146,110,114,120,58]

### Liquidity (Stablecoin) Mint Account

spl-token create-token --fee-payer tutorial-0.json -u https://api.devnet.solana.com/
Creating token 8PsNqXkQWjxX51dRezzEY8XmzgKbKzG8GXFcQSGEG9xs
Signature: Bh2peHESJ9TuwDbemzLZm3HPpc4cdZiJc9HJTcyjJcVbr2zkD3HtGoZstNGiwdbDSc1nj5JcHJg5TYU8PxYu27K

### Useful commands to get started

solana-keygen new -o tutorial-0.json
solana config set --keypair tutorial-0.json
anchor build
anchor deploy -k tutorial-0.json -u https://api.devnet.solana.com/
solana airdrop 5 BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y --url https://api.devnet.solana.com/
solana airdrop 5 BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y --url https://api.devnet.solana.com/
solana airdrop 5 BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y --url https://api.devnet.solana.com/
anchor deploy -k tutorial-0.json -u https://api.devnet.solana.com/
node client.js
