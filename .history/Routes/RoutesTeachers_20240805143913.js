const { Router } = require("express");
const {
  createUsersValidator,
  UpdateUserPassword,
  getOneUserValidator,
} = require("../Resuble/UsersvalidatorError");
const {
  verifyRegister,
  createUsers,
  getUsers,

  getUser,
  updateLoggedUserPassword,
  getLoggedUserData,
  updateUserPoint,
} = require("../Service/UsersService");
const { protect, allowedTo } = require("../Service/AuthService");
const {
  createTeachers,
  UploadImageService,
  resizeImage,
  getTeachers,
  getTeacher,
  deleteTeacher,
  updateTeacher,
} = require("../Service/TeachersService");
const {
  createTeachersValidator,
  deleteOneTeacherValidator,
  updateTeacherValidator,
} = require("../Resuble/TeachersvalidatorError");

const Routes = Router();

// Only Access the Logged Users

Routes.get("/getMe", protect, getLoggedUserData, getUser);

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
// Routes.route("/addpoint/:id").put(updateUserPoint);
Routes.route("/:id")
  // .get(getOneUserValidator, getTeacher)
  .get(getOneUserValidator, getTeacher)
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

module.exports = Routes;
