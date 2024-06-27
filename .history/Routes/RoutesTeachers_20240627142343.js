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
  //   updateUser,
  //   deleteUser,
  getUser,

  //   uploadImage,
  //   resizeImageUsers,
  updateLoggedUserPassword,
  getLoggedUserData,
  updateUserPoint,
  //   updateLoggedUserData,

  //   updateUserRole,
  //   updateUserStatus,
} = require("../Service/UsersService");
const { protect, allowedTo } = require("../Service/AuthService");
const { createTeachers } = require("../Service/TeachersService");
const { createTeachersValidator } = require("../Resuble/TeachersvalidatorError");
// const {
//   createUsersValidator,
//   getOneUserValidator,
//   updateOneUserValidator,
//   deleteOneUserValidator,
//   UpdateUserPassword,
//   updateLoggedUserValidator,
//   LoginDashboardValidator,
// } = require("../Resuble/UsersvalidatorError");

const Routes = Router();

// Only Access the Logged Users
Routes.use(protect);
Routes.get("/getMe", getLoggedUserData, getUser);
// Routes.put(
//   "/updateMe",
//   uploadImage,
//   resizeImageUsers,
//   updateLoggedUserValidator,
//   updateLoggedUserData
// );

Routes.put("/changeUserPassword", UpdateUserPassword, updateLoggedUserPassword);

// // Only Access the Admin

// Routes.route("/updateUseRole/:id").put(updateUserRole);
// Routes.route("/updateUserStatus/:id").put(updateUserStatus);

Routes.route("/")
  .post(allowedTo("manager"),Upload,createTeachersValidator, createTeachers)
  .get(getUsers);
Routes.route("/verifycode").post(verifyRegister);
Routes.route("/addpoint/:id").put(updateUserPoint);
Routes.route("/:id").get(getOneUserValidator, getUser);
//   .patch(uploadImage, resizeImageUsers, updateOneUserValidator, updateUser)
//   .delete(deleteOneUserValidator, deleteUser);
module.exports = Routes;
