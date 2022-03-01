const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./config/db.config")();

app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URL }));

const API_VERSION = "v0";

const userRouter = require("./routes/user.routes");
app.use(`/api/${API_VERSION}/users`, userRouter);

const goalRouter = require("./routes/goal.routes.js");
app.use(`/api/${API_VERSION}/goals`, goalRouter);

app.listen(Number(process.env.PORT), () => {
  console.log("Server UP! PORT: ", process.env.PORT);
});
