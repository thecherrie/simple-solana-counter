import {web3} from '@project-serum/anchor';
import kp from '../keypair.json';

const raw = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(raw);

export const numberAccount = web3.Keypair.fromSecretKey(secret);
export const incrementAccount = web3.Keypair.generate()