const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const {
  createChapters,
  getChapters,
  getChapter,
  deleteChapter
} = require("../Service/ChapterService");
const {
  createChaptersValidator,
  getChapterValidator,
  deleteChapterValidator,
} = require("../Resuble/ChapterValidationError");
const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));

Routes.route("/")
  .post(createChaptersValidator, createChapters)
  .get(getChapters);
Routes.route("/:id")
  .get(getChapterValidator, getChapter)
  .put()
  .delete(deleteChapterValidator, deleteChapter);
module.exports = Routes;
