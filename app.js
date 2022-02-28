require("dotenv").config();
const express = require("express");
const app = express();
const dbConnection = require("./config/db.config");
dbConnection();

app.use(express.json());

app.listen(Number(process.env.PORT), () => {
  console.log("Server UP! PORT: ", process.env.PORT);
});
