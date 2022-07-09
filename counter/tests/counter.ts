import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Counter } from "../target/types/counter";

describe("counter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Counter as Program<Counter>;
  const {SystemProgram} = anchor.web3;

  const numberAccount = anchor.AnchorProvider.env().wallet;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
    console.log("Initialised number account", await program.account.numberAccount.all())
  });

  it('Increments number', async () => {
    const tx = await program.methods.increment({
      accounts: {
        numberAccount: numberAccount.publicKey,
        authority: anchor.AnchorProvider.env().wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [numberAccount]
    });
    console.log("Increment tx => ", await program.account.numberAccount.all())
  })

  it('Decrements number', async () => {
    const tx = await program.methods.decrement({
      accounts: {
        numberAccount: numberAccount.publicKey,
        authority: anchor.AnchorProvider.env().wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [numberAccount]
    });
    console.log("Decrement tx => ", await program.account.numberAccount.all())
  })

  it('Throws error when too large', async () => {
    const tx = await program.methods.increment(11, {
      accounts: {
        numberAccount: numberAccount.publicKey,
        authority: anchor.AnchorProvider.env().wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [numberAccount]
    });
  })
});
