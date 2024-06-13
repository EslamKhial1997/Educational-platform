const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbCollection = require("./Config/config");
const globalError = require("./Middleware/globalError");
const RoutesUsers = require("./Routes/RoutesUsers");
const RoutesAuth = require("./Routes/RoutesAuth");
const ApiError = require("./Resuble/ApiErrors");
const app = express();

app.use(express.json());
dotenv.config({ path: "config.env" });

dbCollection();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use("/api/v1/auth", RoutesAuth);
app.use("/api/v1/users", RoutesUsers);
app.use("/api/v1/coupons", RoutesUsers);
const PORT = process.env.PORT || 8008;
const server = app.listen(PORT, () => {
  console.log(`Listen on the ${PORT}`);
});
app.all("*", (req, res, next) => {
  next(new ApiError(`Sorry This URL ${req.originalUrl} does not exist`, 400));
});
app.use(globalError);
