import * as anchor from "@project-serum/anchor";
import { TokenInstructions } from "@project-serum/serum";
import {
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Account,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";

const programPublicKey = "UpbA7oUWbQiXyvbkrMtfMF2gZ3W7F6U3jqxXbUvyPrD";
const programId = new anchor.web3.PublicKey(programPublicKey);

export const TROVE_DATA_SEED = "trove_data_7";
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export const WRAPPED_SOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112"
);

export async function findAssociatedTokenAddress(
  owner: PublicKey,
  tokenMintAddress: PublicKey
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [
        owner.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];
}

export async function checkIfAccountExists(
  connection: Connection,
  account: PublicKey
): Promise<boolean> {
  const acc = await connection.getAccountInfo(account);
  console.log(`Account ${account} exists ${JSON.stringify(acc)}`);
  return acc != null;
}

export async function createAssociatedTokenAccountIx(
  fundingAddress: PublicKey,
  walletAddress: PublicKey,
  splTokenMintAddress: PublicKey
) {
  const associatedTokenAddress = await findAssociatedTokenAddress(
    walletAddress,
    splTokenMintAddress
  );
  const systemProgramId = new PublicKey("11111111111111111111111111111111");
  const keys = [
    {
      pubkey: fundingAddress,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: associatedTokenAddress,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: walletAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: splTokenMintAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: systemProgramId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TokenInstructions.TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  const ix = new TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
  return [ix, associatedTokenAddress];
}

export async function troveDataPubkey(userPubKey: PublicKey, seed: string) {
  // userPubKey is my SOLANA address
  // This function will *always* return the same value
  // This is essentially my metadata address

  let account = await PublicKey.createWithSeed(userPubKey, seed, programId);

  console.log(`Trove Account ${account}`);
  return account;
}

export async function createSolAccount(
  connection: Connection,
  payer: PublicKey
): Promise<[TransactionInstruction, Keypair]> {
  const solAccount = anchor.web3.Keypair.generate();
  const space = 8 + 1;
  const createSolTokenAccountIx = SystemProgram.createAccount({
    programId: programId,
    space: space,
    lamports: await connection.getMinimumBalanceForRentExemption(
      space,
      "singleGossip"
    ),
    fromPubkey: payer,
    newAccountPubkey: solAccount.publicKey,
  });

  return [createSolTokenAccountIx, solAccount];
}
