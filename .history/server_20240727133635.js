const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbCollection = require("./Config/config");
const globalError = require("./Middleware/globalError");
const RoutesUsers = require("./Routes/RoutesUsers");
const RoutesTransactions = require("./Routes/RoutesTransaction");
const RoutesClasses = require("./Routes/RoutesClasses");
const RoutesTeachers = require("./Routes/RoutesTeachers");
const RoutesSections = require("./Routes/RoutesSections");
const RoutesLectures = require("./Routes/RoutesLectures");
const RoutesAuth = require("./Routes/RoutesAuth");
const RoutesCoupons = require("./Routes/RoutesCoupons");
const RoutesChapters = require("./Routes/RoutesChapters");
const RoutesCouress = require("./Routes/RoutesCoures");
const ApiError = require("./Resuble/ApiErrors");
const path = require("path");
const { createFirstManegerAccount } = require("./Service/AuthService");
const app = express();
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json());
dotenv.config({ path: "config.env" });

dbCollection();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use("/api/v1/auth", RoutesAuth);
app.use("/api/v1/users", RoutesUsers);
app.use("/api/v1/transaction", RoutesTransactions);
app.use("/api/v1/teacher", RoutesTeachers);
app.use("/api/v1/class", RoutesClasses);
app.use("/api/v1/section", RoutesSections);
app.use("/api/v1/lecture", RoutesLectures);
app.use("/api/v1/coupon", RoutesCoupons); 
app.use("/api/v1/chapter", RoutesChapters);
app.use("/api/v1/coures", RoutesCouress);
createFirstManegerAccount()
const PORT = process.env.PORT || 8008; 
const server = app.listen(PORT, () => {
  console.log(`Listen on the ${PORT}`);
}); 
app.all("*", (req, res, next) => {
  next(new ApiError(`Sorry This URL ${req.originalUrl} does not exist`, 400));
});
app.use(globalError);
