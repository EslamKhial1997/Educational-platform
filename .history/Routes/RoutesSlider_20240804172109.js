const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");

const { uploadImage, resizeImage } = require("../Utils/imagesHandler");
const { createSlider, getSliders, getSlider } = require("../Service/SliderService");

const Routes = Router();
Routes.use(protect);

Routes.route("/")
  .post(
    allowedTo("admin"),
    uploadImage,
    resizeImage("slider"),
    createSlider
  )
  .get(getSliders);
Routes.route("/:id")
  .get(getSlider)
  .put(uploadImage, resizeImage("gallery"), updateGallery)
.delete( deleteGallery);
module.exports = Routes;
