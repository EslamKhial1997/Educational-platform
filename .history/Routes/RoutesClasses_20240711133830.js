const { Router } = require("express");

const { protect, allowedTo } = require("../Service/AuthService");

const {
  createClasses,
  getClassess,
  getClass,
  uploadImage,
} = require("../Service/ClassService");
const {
  getClassValidator,  
  createClassValidator,
} = require("../Resuble/ClassValidationError copy");

const Routes = Router();
Routes.use(protect);
Routes.use(allowedTo("admin", "manager"));
Routes.route("/").post(uploadImage, createClassValidator, createClasses).get(getClassess);
Routes.route("/:id").get(getClassValidator, getClass);
module.exports = Routes;
