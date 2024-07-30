const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");

const { uploadImage, resizeImage } = require("../Utils/imagesHandler");
const {
  createGallery,
  getGallerys,
  getGallery,
  updateGallery,
} = require("../Service/GalleryService");
const Routes = Router();
Routes.use(protect);

Routes.route("/")
  .post(
    allowedTo("admin", "manager"),
    uploadImage,
    resizeImage("gallery"),
    createGallery
  )
  .get(getGallerys);
Routes.route("/:id")
  .get(getGallery)
  .put(uploadImage, resizeImage("gallery"), updateGallery);
//   .delete(deleteChapterValidator, deleteChapter);
module.exports = Routes;
