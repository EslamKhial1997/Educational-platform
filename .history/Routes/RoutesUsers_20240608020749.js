const { Router } = require("express");
const { createUsersValidator,UpdateUserPassword } = require("../Resuble/UsersvalidatorError");
const {
  verifyRegister,
  createUsers,
  getUsers,
  //   updateUser,
  //   deleteUser,
  getUser,
     updatePassword,
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
Routes.put("/changePassword/:id", UpdateUserPassword, updatePassword)
Routes.put("/changeUserPassword",UpdateUserPassword, updateLoggedUserPassword);
// Routes.post("/forgetPassword", forgetPassword);
// Routes.post("/restCode", restCodeSent);
// // Only Access the Admin

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
