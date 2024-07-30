const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");

const { uploadImage, resizeImage } = require("../Utils/imagesHandler");
const { createGallery } = require("../Service/GalleryService");
const Routes = Router();
Routes.use(protect);


Routes.route("/").post(uploadImage, resizeImage("gallery"), createGallery);
//   .get(getChapters);
// Routes.route("/:id")
//   .get(getChapterValidator, getChapter)
//   .put(uploadImage ,updateChapterValidator,resizeImage("chapter"),updateChapter)
//   .delete(deleteChapterValidator, deleteChapter);
module.exports = Routes;
