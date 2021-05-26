: solana-keygen new -o tutorial-0.json
Generating a new keypair

For added security, enter a BIP39 passphrase

NOTE! This passphrase improves security of the recovery seed phrase NOT the
keypair file itself, which is stored as insecure plain text

BIP39 Passphrase (empty for none):

Wrote new keypair to tutorial-0.json
============================================================================
pubkey: BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y
============================================================================
Save this seed phrase and your BIP39 passphrase to recover your new keypair:
multiply volcano napkin aim damage field limit blood night one letter season
============================================================================

solana-keygen new -o tutorial-0.json
solana config set --keypair tutorial-0.json
anchor build
anchor deploy -k tutorial-0.json -u https://api.devnet.solana.com/
solana airdrop 5 BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y --url https://api.devnet.solana.com/
solana airdrop 5 BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y --url https://api.devnet.solana.com/
solana airdrop 5 BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y --url https://api.devnet.solana.com/
anchor deploy -k tutorial-0.json -u https://api.devnet.solana.com/
node client.js
