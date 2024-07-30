const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const {
  createChapters,
  getChapters,
  getChapter,
  updateChapter,
  deleteChapter,
} = require("../Service/ChapterService");
const {
  createChaptersValidator,
  getChapterValidator,
  updateChapterValidator,
  deleteChapterValidator,
} = require("../Resuble/ChapterValidationError");
const { uploadImage, resizeImage } = require("../Utils/imagesHandler");
const { createHonor } = require("../Service/HonorService");
const Routes = Router();
Routes.use(protect);

Routes.route("/").post(
  allowedTo("admin", "manager"),
  uploadImage,
  resizeImage("honor"),
  createHonor
).get(getHonor);
// Routes.route("/:id")
//   .get(getChapterValidator, getChapter)
//   .put(
//     uploadImage,
//     updateChapterValidator,
//     resizeImage("chapter"),
//     updateChapter
//   )
//   .delete(deleteChapterValidator, deleteChapter);
module.exports = Routes;
