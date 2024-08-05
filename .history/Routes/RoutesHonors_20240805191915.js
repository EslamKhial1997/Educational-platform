const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");
const { uploadImage, resizeImage } = require("../Utils/imagesHandler");
const { createHonor, getHonors, getHonor, updateHonor } = require("../Service/HonorService");
const { updateClassValidator } = require("../Resuble/ClassValidationError");
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
    updateClassValidator,
    resizeImage("honor"),
    updateHonor
  ).delete(deleteH);
module.exports = Routes;
