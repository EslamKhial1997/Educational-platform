const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const useragent = require("express-useragent");
const requestIp = require("request-ip");
const path = require("path");

const dbCollection = require("./config/config");
const globalError = require("./Middleware/globalError");
const ApiError = require("./Resuble/ApiErrors");

const RoutesUsers = require("./Routes/RoutesUsers");
const RoutesTransactions = require("./Routes/RoutesTransaction");
const RoutesClasses = require("./Routes/RoutesClasses");
const RoutesAuth = require("./Routes/RoutesAuth");
const RoutesTeachers = require("./Routes/RoutesTeachers");
const RoutesSections = require("./Routes/RoutesSections");
const RoutesLectures = require("./Routes/RoutesLectures");
const RoutesCoupons = require("./Routes/RoutesCoupons");
const RoutesCouress = require("./Routes/RoutesCoures");
const RoutesSliders = require("./Routes/RoutesSlider");
const RoutesGallerys = require("./Routes/RoutesGallerys");
const RoutesHonors = require("./Routes/RoutesHonors");
const { createFirstManagerAccount } = require("./Service/AuthService");

dotenv.config({ path: "config.env" });

const app = express();
app.use(express.static(path.join(__dirname, "./uploads/")));
app.use(express.static(path.join(__dirname, "build/index.html")));
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
