const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const { uploadImage, resizeImage } = require("../Utils/imagesHandler");
const {
  createHonor,
  getHonors,
  getHonor,
  updateHonor,
  deleteHonor,
} = require("../Service/HonorService");
const { updateClassValidator } = require("../Resuble/ClassValidationError");
const Routes = Router();


Routes.route("/")
  .post(
    protect,
    allowedTo("admin", "manager"),
    uploadImage,
    resizeImage("honor"),
    createHonor
  )
  .get(getHonors);
Routes.route("/:id")
  .get(getHonor)
  .put(
    allowedTo("admin", "manager"),
    uploadImage,
    updateClassValidator,
    resizeImage("honor"),
    updateHonor
  )
  .delete(allowedTo("admin", "manager"), deleteHonor);
module.exports = Routes;
