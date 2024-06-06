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
  app.use(cors());
  const PORT = process.env.PORT || 8008;
  const server = Theserver.listen(PORT, () => {
    console.log(`Listen on the ${PORT}`);
  });
  app.all("*", (req, res, next) => {
    next(new ApiError(`Sorry This URL ${req.originalUrl} does not exist`, 400));
  });
  app.use(glob);