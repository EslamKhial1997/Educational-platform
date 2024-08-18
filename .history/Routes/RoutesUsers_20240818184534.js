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

} = require("../Service/UsersService");
const { protect, allowedTo, getLoggedUserData } = require("../Service/AuthService");
const { resizeImageAuth } = require("../Utils/imagesHandler");

const Routes = Router();
Routes.get("/getMe", protect, getLoggedUserData, (req, res, next) => {
  const model = req.model;
  getUserبون(model)(req, res, next);
});
Routes.put(
  "/updateMe",
  protect,
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
