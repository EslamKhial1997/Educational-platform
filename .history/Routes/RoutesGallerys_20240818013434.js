const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");

const { uploadImage, resizeImage } = require("../Utils/imagesHandler");
const {
  createGallery,
  getGallerys,
  getGallery,
  updateGallery,
  deleteGallery,
} = require("../Service/GalleryService");
const Routes = Router();

Routes.route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadImage,
    resizeImage("gallery"),
    createGallery
  )
  .get(getGallerys);
Routes.route("/:id")
  .get(getGallery)
  .put(
    protect,
    allowedTo("admin", "manager"),
    uploadImage,
    resizeImage("gallery"),
    updateGallery
  )
  .delete(protect, allowedTo("admin", "manager"), deleteGallery);
module.exports = Routes;
