import anchor, { Program, web3, BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import getProvider from "./get_provider";
import idl from "../idl/counter.json";
import { incrementAccount, numberAccount } from "./get_accounts";

const programId = new PublicKey(idl.metadata.address);

const { SystemProgram } = web3;

// Check number account does exist
export const getNumberAccount = async (): Promise<Object | null> => {
  const provider = await getProvider();
  const program = new Program(idl, programId, provider);

  console.log(await program.account.numberAccount.all());

  try {
    const account = await program.account.numberAccount.fetch(
      numberAccount.publicKey
    );
    return account;
  } catch (e) {
    console.info("Account does not exist.");
    return null;
  }
};

// If it doesn't already exist, initialise a new number account
export const initCounter = async () => {
  const provider = await getProvider();
  const program = new Program(idl, programId, provider);

  await program.methods
    .initialize()
    .accounts({
      numberAccount: numberAccount.publicKey,
      authority: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([numberAccount])
    .rpc();

  const account = await program.account.numberAccount.fetch(
    numberAccount.publicKey
  );
};

// Increment impl
export const increment = async (byAmount: number): Promise<string> => {
  const provider = await getProvider();
  const program = new Program(idl, programId, provider);

  await program.methods
    .increment(new BN(byAmount | 1))
    .accounts({
      numberAccount: numberAccount.publicKey,
    })
    .rpc();

  const tx = await program.account.numberAccount.fetch(numberAccount.publicKey);
  return await (tx.value as string).toString();
};

// Decrement impl
export const decrement = async (byAmount: number): Promise<string> => {
  const provider = await getProvider();
  const program = new Program(idl, programId, provider);

  await program.methods
    .decrement(new BN(byAmount | 1))
    .accounts({
      numberAccount: numberAccount.publicKey,
    })
    .rpc();

  const tx = await program.account.numberAccount.fetch(numberAccount.publicKey);
  return await (tx.value as string).toString();
};
