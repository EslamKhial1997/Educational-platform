const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const { createChapters, getChapters, getChapter } = require("../Service/ChapterService");
const { createChaptersValidator ,getChapterValidator } = require("../Resuble/ChapterValidationError");
const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));

Routes.route("/").post(createChaptersValidator, createChapters).get( getChapters);
Routes.route("/:id").get(getChapterValidator,getChapter).delete(deleteChapterValidator,deleteCoupon);
module.exports = Routes;
