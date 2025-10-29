import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.post("/buy", async (req, res) => {
  try {
    const { user_id, amount, price, tx_hash } = req.body;

    const trade = await prisma.user.create({
      data: {
        user_id,
        side: "buy",
        amount: Number(amount),
        price: Number(price),
        tx_hash,
        timestamp: new Date(),
      },
    });

    res.status(200).json({ message: "Buy order placed successfully", trade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to place buy order" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
