const { Router } = require("express");
const { createUsersValidator } = require("../Resuble/UsersvalidatorError");
const {
  verifyRegister,
  createUsers,
  getUsers,
  //   updateUser,
  //   deleteUser,
  getUser,
  //   updatePassword,
  //   uploadImage,
  //   resizeImageUsers,
  updateLoggedUserPassword,
  getLoggedUserData,
  //   updateLoggedUserData,

  //   updateUserRole,
  //   updateUserStatus,
} = require("../Service/UsersService");
const { protect, allowedTo } = require("../Service/AuthService");
// const {
//   createUsersValidator,
//   getOneUserValidator,
//   updateOneUserValidator,
//   deleteOneUserValidator,
//   UpdateUserPassword,
//   updateLoggedUserValidator,
//   LoginDashboardValidator,
// } = require("../Resuble/UsersvalidatorError");
// const {
//   protect,
//   allowedTo,
//   forgetPassword,
//   restCodeSent,
//   restNewPassword,
// } = require("../Services/AuthService");

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
// Routes.put("/changePassword/:id", UpdateUserPassword, updatePassword);
Routes.put("/changeUserPassword", updateLoggedUserPassword);
// Routes.post("/forgetPassword", forgetPassword);
// Routes.post("/restCode", restCodeSent);
// Routes.patch("/restNewPasswordDashboard", restNewPassword("passwordDB"));
// // Only Access the Admin
// Routes.use(allowedTo("admin", "manger"));
// Routes.route("/createpasswordDashboard").post(createpasswordDashboard);
// Routes.post("/loginDashboard", LoginDashboardValidator, LoginDashboard);
// Routes.route("/updatepasswordDashboard/:id").put(updatePasswordDashboard);
// Routes.route("/updateUseRole/:id").put(updateUserRole);
// Routes.route("/updateUserStatus/:id").put(updateUserStatus);

Routes.use(allowedTo("admin", "manager"));
Routes.route("/").post(createUsersValidator, createUsers).get(getUsers);
Routes.route("/verifycode").post(verifyRegister);

// Routes.route("/:id")
//   .get(getOneUserValidator, getUser)
//   .patch(uploadImage, resizeImageUsers, updateOneUserValidator, updateUser)
//   .delete(deleteOneUserValidator, deleteUser);
module.exports = Routes;
