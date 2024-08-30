const { Router } = require("express");

const {
  
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
  updateSpecificPaid,
} = require("../Service/TeachersService");
const {
  createTeachersValidator,
  deleteOneTeacherValidator,
  updateTeacherValidator,
  UpdatePaidTeacherValidation,
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
  Routes.post("/restCode", restCo);
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
Routes.route("/paid/:id").put(
  protect,
  allowedTo("teacher"),
  UpdatePaidTeacherValidation,
  updateSpecificPaid
);
module.exports = Routes;
