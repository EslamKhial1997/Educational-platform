const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const { createChapters, getChapters, getChapter } = require("../Service/ChapterService");
const { ChapterValidator } = require("../Resuble/ChapterValidationError");
const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));

Routes.route("/").post(createChaptersValidator, createChapters).get( getChapters);
Routes.route("/:id").get(getChapter).delete(deleteCoupon);
module.exports = Routes;
