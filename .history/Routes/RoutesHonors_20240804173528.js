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
const { createHonor, getHonors, getHonor, updateHonor } = require("../Service/HonorService");
const Routes = Router();
Routes.use(protect);

Routes.route("/").post(
  allowedTo("admin", "manager"),
  uploadImage,
  resizeImage("honor"),
  createHonor
).get(getHonors);
Routes.route("/:id")
  .get( getHonor)
  .put(
    uploadImage,
    updateChapterValidator,
    resizeImage("honor"),
    updateHonor
  )
//   .delete(deleteChapterValidator, deleteChapter);
module.exports = Routes;
