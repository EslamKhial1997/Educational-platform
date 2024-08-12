const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");

const { uploadImage, resizeImage } = require("../Utils/imagesHandler");
const {
  createSlider,
  getSliders,
  getSlider,
  updateSlider,
  deleteSlider,
} = require("../Service/SliderService");

const Routes = Router();


Routes.route("/")
  .post(
    allowedTo("admin", "manager"),
    uploadImage,
    resizeImage("slider"),
    createSlider
  )
  .get(getSliders);
Routes.route("/:id")
  .get(getSlider)
  .put(
    allowedTo("admin", "manager"),
    uploadImage,
    resizeImage("slider"),
    updateSlider
  )
  .delete(allowedTo("admin", "manager"), deleteSlider);
module.exports = Routes;
