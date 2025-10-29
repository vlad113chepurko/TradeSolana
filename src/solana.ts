import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';

const keypair = Keypair.generate();
console.log(`Generated keypair: ${keypair}`);


const connection = new Connection('https://api.mainnet-beta.solana.com', "confirmed");

async function getBalance(publicKey: string) {
  const balance = await connection.getBalance(new PublicKey(publicKey));
  console.log(`Balance for ${publicKey}: ${balance / LAMPORTS_PER_SOL} SOL`);
}

getBalance(keypair.publicKey.toBase58());

export { getBalance, keypair, connection };