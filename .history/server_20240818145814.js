const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const useragent = require("express-useragent");
const requestIp = require("request-ip");
const path = require("path");

const dbCollection = require("./config/config");
const globalError = require("./");
const ApiError = require("./utils/ApiError");

const RoutesUsers = require("./routes/RoutesUsers");
const RoutesTransactions = require("./routes/RoutesTransaction");
const RoutesClasses = require("./routes/RoutesClasses");
const RoutesTeachers = require("./routes/RoutesTeachers");
const RoutesSections = require("./routes/RoutesSections");
const RoutesLectures = require("./routes/RoutesLectures");
const RoutesAuth = require("./routes/RoutesAuth");
const RoutesCoupons = require("./routes/RoutesCoupons");
const RoutesCouress = require("./routes/RoutesCoures");
const RoutesSliders = require("./routes/RoutesSlider");
const RoutesGallerys = require("./routes/RoutesGallerys");
const RoutesHonors = require("./routes/RoutesHonors");

const { createFirstManagerAccount } = require("./services/authService");

dotenv.config({ path: "config.env" });

const app = express();
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.json());

dbCollection();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

createFirstManagerAccount();

app.use(cors());
app.use(useragent.express());
app.use(requestIp.mw());

// ربط المسارات بالتطبيق
app.use("/api/v1/auth", RoutesAuth);
app.use("/api/v1/users", RoutesUsers);
app.use("/api/v1/transaction", RoutesTransactions);
app.use("/api/v1/teacher", RoutesTeachers);
app.use("/api/v1/class", RoutesClasses);
app.use("/api/v1/section", RoutesSections);
app.use("/api/v1/lecture", RoutesLectures);
app.use("/api/v1/coupon", RoutesCoupons);
app.use("/api/v1/coures", RoutesCouress);
app.use("/api/v1/slider", RoutesSliders);
app.use("/api/v1/gallery", RoutesGallerys);
app.use("/api/v1/honor", RoutesHonors);

const PORT = process.env.PORT || 8008;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// معالجة أي طلبات لم يتم التعرف عليها
app.all("*", (req, res, next) => {
  next(new ApiError(`Sorry, this URL ${req.originalUrl} does not exist`, 400));
});

// Middleware لمعالجة الأخطاء العامة
app.use(globalError);
