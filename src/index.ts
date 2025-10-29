const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");



dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
