import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import { sendSol } from "./solana";
import { PublicKey } from "@solana/web3.js";

dotenv.config();

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.post("/buy", async (req, res) => {
  try {
    const { user_id, amount, price, token } = req.body;

    if (!user_id || !amount || !price || !token) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const tx_hash = await sendSol(token, amount);

    const trade = await prisma.trade.create({
      data: {
        user_id,
        token: token,
        side: "buy",
        amount: amount,
        price: price,
        tx_hash: tx_hash,
        timestamp: new Date(),
      },
    });

    res.status(200).json({ message: "Buy order placed successfully", trade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to place buy order" });
  }
});

app.post("/sell", async (req, res) => {
  try {
    const { user_id, amount, price, token } = req.body;

    if (!user_id || !amount || !price || !token) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const tx_hash = await sendSol(token, amount);

    const trade = await prisma.trade.create({
      data: {
        user_id,
        token: token,
        side: "sell",
        amount: amount,
        price: price,
        tx_hash: tx_hash,
        timestamp: new Date(),
      },
    });

    res.status(200).json({ message: "Sell order placed successfully", trade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to place sell order" });
  }
});

app.get("/pnl/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id parameter" });
    }
    const trades = await prisma.trade.findMany({
      where: { user_id: user_id },
    });

    const tokensMap: Record<string, { buy: number; sell: number }> = {};

    trades.forEach((trade) => {
      const token = trade.token;
      if (!tokensMap[token]) tokensMap[token] = { buy: 0, sell: 0 };

      if (trade.side === "buy") {
        tokensMap[token].buy += trade.amount * trade.price;
      } else if (trade.side === "sell") {
        tokensMap[token].sell += trade.amount * trade.price;
      }
    });

    const tokens = Object.entries(tokensMap).map(([token, { buy, sell }]) => ({
      token,
      pnl: sell - buy,
    }));

    const total_pnl = tokens.reduce((acc, t) => acc + t.pnl, 0);

    res.status(200).json({ user_id, tokens, total_pnl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve PnL" });
  }
});

app.post("/connectWallet", (req, res) => {
  try {
    const { publicKey } = req.body;
    if (!publicKey) {
      return res
        .status(400)
        .json({ error: "Missing publicKey in request body" });
    }
    try {
      new PublicKey(publicKey);
      res.status(200).json({ message: "Wallet connected successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to connect wallet" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to connect wallet" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
