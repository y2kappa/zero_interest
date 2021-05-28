// client.js is used to introduce the reader to generating clients from IDLs.
// It is not expected users directly test with this example. For a more
// ergonomic example, see `tests/basic-0.js` in this workspace.
import * as anchor from '@project-serum/anchor';
import {publicKeyLayout} from '@project-serum/serum/lib/layout';
import {Connection, PublicKey, SystemProgram, TransactionInstruction,} from '@solana/web3.js';
import * as fs from 'fs';
import * as utils from './utils';

/// Accounts
const liquidityCurrencyMintPubkey =
    '8PsNqXkQWjxX51dRezzEY8XmzgKbKzG8GXFcQSGEG9xs';
const liquidityCurrencyMint = new PublicKey(liquidityCurrencyMintPubkey);
const splTokenProgramId = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

/// After initialization
const lendingMarketPubkey = '9GLFTCJV1nevb5QKYsCZvAUtxZoEvVLMRVzrHPoDyJK9';
const lendingMarketSecret = Uint8Array.from([
  198, 88,  4,   216, 87,  98,  235, 163, 167, 71,  56,  180, 32,
  209, 7,   42,  149, 21,  218, 245, 105, 98,  32,  133, 17,  251,
  255, 102, 212, 210, 175, 176, 122, 202, 248, 255, 125, 134, 60,
  160, 62,  241, 152, 158, 18,  104, 59,  125, 71,  136, 18,  96,
  12,  152, 80,  146, 54,  66,  196, 186, 70,  175, 152, 64,
]);

// LendingMarketAccount {
//   version: 0,
//   bump_seed: 252,
//   owner: BSKmmWSyV42Pw3AwZHRFyiHpcBpQ3FyCYeHVecUanb6y,
//   token_program_id: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA,
//   liquidity_token_mint: 8PsNqXkQWjxX51dRezzEY8XmzgKbKzG8GXFcQSGEG9xs
// }

// const anchor = require('@project-serum/anchor');
const programPublicKey = 'UpbA7oUWbQiXyvbkrMtfMF2gZ3W7F6U3jqxXbUvyPrD';
const programId = new anchor.web3.PublicKey(programPublicKey);
const idl = JSON.parse(fs.readFileSync('./target/idl/basic_0.json', 'utf8'));

// Configure the local cluster.
const provider = anchor.Provider.local('https://api.devnet.solana.com/');
anchor.setProvider(provider);
const program = new anchor.Program(idl, programId);

// Instructions

// Only call this once
async function initializeMarket() {
  // const lendingMarketAccount =
  // anchor.web3.Keypair.fromSecretKey(lendingMarketSecret);
  const lendingMarketAccount = anchor.web3.Keypair.generate();
  const owner = provider.wallet.publicKey;
  const liquidityCurrencyMint =
      new anchor.web3.PublicKey(liquidityCurrencyMintPubkey);
  const splTokenProgramAccount = new anchor.web3.PublicKey(splTokenProgramId);

  console.log(`Payer Pubkey ${provider.wallet.publicKey}`);
  console.log(
      `Lending Market Account Pub ${lendingMarketAccount.publicKey} Secret ${
          lendingMarketAccount.secretKey}`);

  const space = 1 + 1 + 32 + 32 + 32;

  await program.rpc.initializeMarket(owner, {
    accounts: {
      lendingMarketAccount: lendingMarketAccount.publicKey,
      liquidityCurrencyMint: liquidityCurrencyMint,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      tokenProgram: splTokenProgramAccount,
    },
    signers: [lendingMarketAccount],
    instructions: [
      anchor.web3.SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: lendingMarketAccount.publicKey,
        space: 8 + space,  // Add 8 for the account discriminator.
        lamports: await provider.connection.getMinimumBalanceForRentExemption(
            8 + space),
        programId: program.programId,
      }),
    ],
  });
}

async function initializeTrove() {
  const owner = provider.wallet.publicKey;

  const associatedTokenAccount =
      await utils.findAssociatedTokenAddress(owner, liquidityCurrencyMint);
  const associatedTokenAccountExists = await utils.checkIfAccountExists(
      provider.connection, associatedTokenAccount);

  const troveDataAccount =
      await utils.troveDataPubkey(owner, utils.TROVE_DATA_SEED);
  const troveDataAccountExists = await utils.checkIfAccountExists(
      provider.connection, associatedTokenAccount);

  const space = 8 + 145;
  const authority = new anchor.web3.Account();

  const ixCreateTroveDataAccount = SystemProgram.createAccountWithSeed({
    fromPubkey: owner,
    newAccountPubkey: troveDataAccount,
    basePubkey: owner,
    seed: utils.TROVE_DATA_SEED,
    lamports: await provider.connection.getMinimumBalanceForRentExemption(
        space, 'singleGossip'),
    space: space,
    programId: programId,
  });

  const [ixAssociatedStableCoin, addressAssociatedStableCoin] =
      await utils.createAssociatedTokenAccountIx(
          provider.wallet.publicKey, provider.wallet.publicKey,
          liquidityCurrencyMint);

  const [ixAssociatedSol, addresAssociatedSol] =
      await utils.createSolAccount(provider.connection, owner);

  console.log(`Associated Token Account ${associatedTokenAccount}`);
  console.log(`Exists ${troveDataAccountExists}`);
  console.log(`Trove Data Account ${troveDataAccount}`);
  console.log(`Exists ${associatedTokenAccountExists}`);

  console.log(`owner ${owner}`);
  console.log(`troveDataAccount ${troveDataAccount}`);
  console.log(`associatedTokenAccount ${associatedTokenAccount}`);
  console.log(`associatedSolAccount ${addresAssociatedSol.publicKey}`);

  let ixCreateAssociatedStableCoinAccount = [];
  if ((await utils.checkIfAccountExists(
          provider.connection, associatedTokenAccount)) == false) {
    ixCreateAssociatedStableCoinAccount.push(ixAssociatedStableCoin);
  }

  await program.rpc.initializeTrove({
    accounts: {
      troveDataAccount: troveDataAccount,
      owner: owner,
      authority: authority.publicKey,
      lendingMarketAccount: lendingMarketPubkey,
      solSourceAccount: owner,
      solEscrowAccount: addresAssociatedSol.publicKey,
      stablecoinDestinationAssociatedAccount: addressAssociatedStableCoin,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [authority, addresAssociatedSol],
    instructions: [
      ixCreateTroveDataAccount,
      ...ixCreateAssociatedStableCoinAccount,
      ixAssociatedSol,
    ],
  });
}
async function depositTroveSol() {
  await program.rpc.depositTroveSol(
      new anchor.BN(1234), new anchor.BN(1234),
      {
          // accounts: {
          //   troveDataAccount: 12321,
          // },
          // instrctions: [
          //   ...,
          //   ...
          // ],
          // signers: []
      });
}

async function getTroveData() {
  // Fetch the newly created account from the cluster.
  const owner = provider.wallet.publicKey;

  const troveDataAccount =
      await utils.troveDataPubkey(owner, utils.TROVE_DATA_SEED);

  const account = await program.account.troveData(troveDataAccount);

  console.log(`Trove Data Account ${JSON.stringify(account)}`);
}

console.log('Running client.');
// initializeMarket().then(() => console.log('Success'));
// initializeTrove().then(() => console.log('Success'));
getTroveData().then(() => console.log('Success'));
// depositTroveSol().then(() => console.log('Success'));
