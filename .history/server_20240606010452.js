const express = require('express');
const dotenv = require("dotenv");
const dbCollection = require('./Config/config');
const app = express();


app.use(express.json());
dotenv.config({ path: "config.env" });

dbCollection()
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }