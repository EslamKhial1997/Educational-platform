const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");

const { uploadImage, resizeImage } = require("../Utils/imagesHandler");
const { createGallery, getGallerys } = require("../Service/GalleryService");
const Routes = Router();
Routes.use(protect);

Routes.route("/").post(
  allowedTo("admin", "manager"),
  uploadImage,
  resizeImage("gallery"),
  createGallery
).get(getGallerys);
 Routes.route("/:id")
.get(, getChapter)
//   .put(uploadImage ,updateChapterValidator,resizeImage("chapter"),updateChapter)
//   .delete(deleteChapterValidator, deleteChapter);
module.exports = Routes;
