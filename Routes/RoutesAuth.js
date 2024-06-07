const { Router } = require("express");

const {
  SignupValidator,
  LoginValidator,
} = require("../Resuble/AuthvalidatorError");
const {
  SingUp,
  Login,
  forgetPassword,
  restCodeSent,
  restNewPassword,
} = require("../Service/AuthService");
const { verifyRegister } = require("../Service/UsersService");
const { createUsersValidator } = require("../Resuble/UsersvalidatorError");

// const {
//   createUsersValidator,
//   getOneUserValidator,
//   updateOneUserValidator,
//   deleteOneUserValidator,
//   UpdateUserPassword,
// } = require("../Resuble/UsersvalidatorError");

const Routes = Router();

Routes.route("/signup").post(createUsersValidator, SingUp);
Routes.route("/verifycode").post(verifyRegister);
Routes.route("/login").post(LoginValidator, Login);
Routes.post("/forgetPassword", forgetPassword);
Routes.post("/restCode", restCodeSent);
Routes.put("/restNewPassword", restNewPassword("password"));
// Routes.route("/:id")
//   .get(getOneUserValidator, getUser)
//   .put(uploadImage,resizeImageUsers,updateOneUserValidator, updateUser)
//   .delete(deleteOneUserValidator, deleteUser);
module.exports = Routes;
