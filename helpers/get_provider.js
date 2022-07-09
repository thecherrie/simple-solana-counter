import { AnchorProvider } from "@project-serum/anchor";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import Buffer from "buffer";

const network = clusterApiUrl("devnet");

const opts = {
  preflightCommitment: "processed",
};

const getProvider = async () => {
  window.Buffer = Buffer;
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new AnchorProvider(
    connection,
    window.solana,
    opts.preflightCommitment
  );
  return provider;
};

export default getProvider;
