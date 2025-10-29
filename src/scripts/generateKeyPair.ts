function generateKeyPair() {
  const { Keypair } = require("@solana/web3.js");
  const fs = require("fs");
  
  const keypair = Keypair.generate();
  const secretKey = Array.from(keypair.secretKey);
  
  fs.writeFileSync(
    "./src/scripts/keypair.json",
    JSON.stringify(secretKey)
  );
  
  console.log("Keypair generated and saved to ./src/scripts/keypair.json");
  console.log("Public Key:", keypair.publicKey.toBase58());
}

generateKeyPair();