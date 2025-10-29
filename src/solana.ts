import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const secretKeyArray = JSON.parse(
  fs.readFileSync("./src/scripts/keypair.json", "utf-8")
);
const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));

export async function sendSol(to: string, amountSol: number) {
  if (to === "test") {
    console.log(`Test mode: Simulating sending ${amountSol} SOL to ${to}.`);
    const tx_hash = "TEST_TX_HASH_1234567890";
    return tx_hash;
  } else {
    const tx_hash = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: new PublicKey(to),
        lamports: amountSol * LAMPORTS_PER_SOL,
      })
    );
    const txHash = await sendAndConfirmTransaction(connection, tx_hash, [
      keypair,
    ]);
    console.log(`Sent ${amountSol} SOL to ${to}. TxHash: ${txHash}`);
    return txHash;
  }
}

export async function getBalance(publicKey: string) {
  const balance = await connection.getBalance(new PublicKey(publicKey));
  console.log(`Balance for ${publicKey}: ${balance / LAMPORTS_PER_SOL} SOL`);
  return balance;
}
