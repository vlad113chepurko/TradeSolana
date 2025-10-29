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

app.get("/pnl", async (req, res) => {
  try {
    const { user_id } = req.query as { user_id?: string };
    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id parameter" });
    }
    const trades = await prisma.trade.findMany({
      where: { user_id: "123456" },
    });

    let totalBuy = 0;
    let totalSell = 0;

    trades.forEach((trade) => {
      if (trade.side === "buy") {
        totalBuy += trade.amount * trade.price;
      } else if (trade.side === "sell") {
        totalSell += trade.amount * trade.price;
      }
    });

    const pnl = totalSell - totalBuy;
    res.status(200).json({ message: "PnL retrieved successfully", pnl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve PnL" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
