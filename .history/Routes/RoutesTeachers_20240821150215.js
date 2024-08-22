const { Router } = require("express");

const {
  verifyRegister,
  updateLoggedUserPassword,
} = require("../Service/UsersService");
const { protect, allowedTo } = require("../Service/AuthService");
const {
  createTeachers,
  UploadImageService,
  resizeImage,
  getTeachers,
  deleteTeacher,
  updateTeacher,
  getAllDataTeacher,
} = require("../Service/TeachersService");
const {
  createTeachersValidator,
  deleteOneTeacherValidator,
  updateTeacherValidator,
} = require("../Resuble/TeachersvalidatorError");
const {
  UpdateUserPassword,
  getOneUserValidator,
} = require("../Resuble/UsersvalidatorError");
const Routes = Router();
Routes.put(
  "/changeUserPassword",
  protect,
  UpdateUserPassword,
  updateLoggedUserPassword
);
Routes.route("/")
  .post(
    protect,
    allowedTo("manager"),

    UploadImageService,
    createTeachersValidator,
    resizeImage,
    createTeachers
  )
  .get(getTeachers);
Routes.route("/verifycode").post(verifyRegister);
Routes.route("/:id")
  .get(getOneUserValidator, getAllDataTeacher)
  .delete(
    protect,
    allowedTo("manager"),
    deleteOneTeacherValidator,
    deleteTeacher
  )
  .put(
    protect,
    allowedTo("manager"),
    UploadImageService,
    resizeImage,
    updateTeacherValidator,
    updateTeacher
  );
Routes.route("")
module.exports = Routes;
