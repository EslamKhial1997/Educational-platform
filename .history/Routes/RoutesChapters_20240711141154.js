const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const {
  createChapters,
  getChapters,
  getChapter,
  updateChapter,
  deleteChapter
} = require("../Service/ChapterService");
const {
  createChaptersValidator,
  getChapterValidator,
  updateChapterValidator,
  deleteChapterValidator,
} = require("../Resuble/ChapterValidationError");
const { uploadImage, resizeImage } = require("../Utils/imagesHandler");
const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));

Routes.route("/")
  .post(uploadImage,resizeImage("chapter"),createChaptersValidator, createChapters)
  .get(getChapters);
Routes.route("/:id")
  .get(getChapterValidator, getChapter)
  .put(updateChapterValidator,updateChapter)
  .delete(deleteChapterValidator, deleteChap);
module.exports = Routes;
