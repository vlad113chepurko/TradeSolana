# 📈 Trade API

---

# 🚀 Start server

```bash
npm install
npm run dev
```

# 💸 Example request body (for buy/sell)

```json
{
  "user_id": "123456",
  "token": "test",
  "amount": 10.5,
  "price": 250,
  "tx_hash": "0xabc123"
}
```

# 🔗 Endpoints

| Method   | Endpoint              | Description                              |
| :------- | :-------------------- | :--------------------------------------- |
| **POST** | `/buy`                | Create a buy trade                       |
| **POST** | `/sell`               | Create a sell trade                      |
| **GET**  | `/pnl?user_id=123456` | Get total PnL (Profit and Loss) for user |

