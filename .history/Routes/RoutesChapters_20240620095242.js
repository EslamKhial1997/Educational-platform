const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const { createChapters } = require("../Service/ChapterService");
const { ChapterValidator } = require("../Resuble/ChapterValidationError");
const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));

Routes.route("/").post(ChapterValidator, createChapters).get( getChapt);
// Routes.route("/:id").get(getCoupon).delete(deleteCoupon);
module.exports = Routes;
