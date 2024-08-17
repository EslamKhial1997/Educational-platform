const { Router } = require("express");
const {
  createUsersValidator,
  UpdateUserPassword,
  getOneUserValidator,
  deleteOneUserValidator,
  updateOneUserValidator,
} = require("../Resuble/UsersvalidatorError");
const {
  verifyRegister,
  createUsers,
  getUsers,
  updateUser,
  deleteUser,
  getUser,
  uploadImage,

  updateLoggedUserPassword,
  getLoggedUserData,
} = require("../Service/UsersService");
const { protect, allowedTo } = require("../Service/AuthService");
const { resizeImageAuth } = require("../Utils/imagesHandler");
const createUsersModel = require("../Modules/createUsers");

const Routes = Router();

// Only Access the Logged Users

Routes.get("/getMe", protect, getLoggedUserData, (req, res, next) => {
  const model = req.model;
  getUser(model)(req, res, next);
});

Routes.put("/changeUserPassword", UpdateUserPassword, updateLoggedUserPassword);

// // Only Access the Admin

// Routes.route("/updateUseRole/:id").put(updateUserRole);
// Routes.route("/updateUserStatus/:id").put(updateUserStatus);

Routes.use(allowedTo("admin", "manager"));
Routes.route("/")
  .post(
    uploadImage,
    createUsersValidator,
    resizeImageAuth("admin"),
    createUsers
  )
  .get(getUsers);
Routes.route("/verifycode").post(verifyRegister);
// Routes.route("/addpoint/:id").put(updateUserPoint);
Routes.route("/:id")
  .get(getOneUserValidator, getUser)
  .delete(allowedTo("manager"), deleteOneUserValidator, deleteUser)
  .put(
    uploadImage,
    updateOneUserValidator,
    resizeImageAuth("admin"),
    updateOneUserValidator,
    updateUser
  );
module.exports = Routes;
