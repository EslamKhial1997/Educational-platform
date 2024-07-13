const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");

const {
  createClasses,
  getClassess,
  getClass,
  deleteClass,
} = require("../Service/ClassService");
const {
  getClassValidator,  
  createClassValidator,
  deleteClassValidator,
} = require("../Resuble/ClassValidationError copy");
const { uploadImage, resizeImage } = require("../Utils/imagesHandler");

const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));
Routes.route("/").post(uploadImage,createClassValidator,resizeImage("class"), createClasses).get(getClassess);
Routes.route("/:id").get(getClassValidator, getClass).put().delete(deleteClassValidator,deleteClass);
module.exports = Routes;
