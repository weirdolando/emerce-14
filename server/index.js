require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./config/db");
const PORT = process.env.PORT;
const userExtractor = require("./middleware/userExtractor");

const { userRouter, productRouter, cartRouter } = require("./routers");

db.connect((err) => {
  if (err) return console.error(err);
  console.log("Connected to MySQL");
});

const app = express();
app.use(cors());
app.use(express.json());

app.use("/product", productRouter);
app.use("/user", userRouter);
app.use("/cart", userExtractor, cartRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
