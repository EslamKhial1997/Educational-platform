const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");

const { uploadImage, resizeImage } = require("../Utils/imagesHandler");

const Routes = Router();
Routes.use(protect);

Routes.route("/")
  .post(
    allowedTo("admin"),
    uploadImage,
    resizeImage("slider"),
    createGallery
  )
  .get(getGallerys);
Routes.route("/:id")
  .get(getGallery)
  .put(uploadImage, resizeImage("gallery"), updateGallery)
.delete( deleteGallery);
module.exports = Routes;
