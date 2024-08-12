const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");

const {
  createClasses,
  getClassess,
  getClass,
  deleteClass,
  updateClass,
} = require("../Service/ClassService");
const {
  getClassValidator,
  createClassValidator,
  updateClassValidator,
  deleteClassValidator,
} = require("../Resuble/ClassValidationError");
const { uploadImage, resizeImage } = require("../Utils/imagesHandler");

const Routes = Router();
Routes.use(protect);
Routes.route("/")
  .post(
    allowedTo("admin", "manager"),
    uploadImage,
    createClassValidator,
    resizeImage("class"),
    createClasses
  )
  .get(getClassess);
Routes.route("/:id")
  .get(getClassValidator, getClass)
  .put(
    allowedTo("admin", "manager"),
    uploadImage,
    updateClassValidator,
    resizeImage("class"),
    updateClass
  )
  .delete(allowedTo("admin", "manager"), deleteClassValidator, deleteClass);
module.exports = Routes;
