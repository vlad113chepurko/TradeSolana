import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import { sendSol, getBalance } from "./solana";

dotenv.config();

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.post("/buy", async (req, res) => {
  try {
    const { user_id, amount, price, token } = req.body;

    getBalance(process.env.PUBLIC_KEY || "");

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
