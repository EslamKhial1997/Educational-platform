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
  paidToTeacher,
} = require("../Service/UsersService");
const {
  protect,
  allowedTo,
  getLoggedUserData,
} = require("../Service/AuthService");
const { resizeImageAuth } = require("../Utils/imagesHandler");
const createUsersModel = require("../Modules/createUsers");

const Routes = Router();
Routes.use(protect);
Routes.get("/getMe", getLoggedUserData, (req, res, next) => {
  const model = req.model;
  getUser(model)(req, res, next);
});
Routes.put(
  "/updateMe",
  uploadImage,
  resizeImageAuth("admin"),
  getLoggedUserData,
  updateUser
);
Routes.put("/changeUserPassword", UpdateUserPassword, updateLoggedUserPassword);
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
Routes.route("/:id")
  .post(paidToTeacher)
  .get(getOneUserValidator, getUser(createUsersModel))
  .delete(allowedTo("manager"), deleteOneUserValidator, deleteUser)
  .put(
    uploadImage,
    updateOneUserValidator,
    resizeImageAuth("admin"),
    updateOneUserValidator,
    updateUser
  );
module.exports = Routes;
