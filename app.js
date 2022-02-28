const express = require("express");
const app = express();
require("dotenv").config();
require("./config/db.config")();

app.use(express.json());

const API_VERSION = "v0";

const userRouter = require("./routes/user.routes");
app.use(`/api/${API_VERSION}/users`, userRouter);

app.listen(Number(process.env.PORT), () => {
  console.log("Server UP! PORT: ", process.env.PORT);
});
