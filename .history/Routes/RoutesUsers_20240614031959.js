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
  resizeImage,
} = require("../Service/UsersService");
const { protect, allowedTo } = require("../Service/AuthService");
const { UploadMultiImage } = require("../Middleware/UploadImageMiddleware");

const Routes = Router();

// Only Access the Logged Users
//Routes.use(protect);
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

// Routes.use(allowedTo("admin", "manager"));
Routes.route("/")
  .post(UploadMultiImage, resizeImage, createUsersValidator, createUsers)
  .get(getUsers);
Routes.route("/verifycode").post(verifyRegister);
Routes.route("/:id").get(getOneUserValidator, getUser);
//   .patch(uploadImage, resizeImageUsers, updateOneUserValidator, updateUser)
//   .delete(deleteOneUserValidator, deleteUser);
module.exports = Routes;
