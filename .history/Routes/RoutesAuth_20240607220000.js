const { Router } = require("express");

const {
  SignupValidator,
  LoginValidator,
} = require("../Resuble/AuthvalidatorError"); 
const { SingUp } = require("../Service/AuthService");

// const {
//   createUsersValidator,
//   getOneUserValidator,
//   updateOneUserValidator,
//   deleteOneUserValidator,
//   UpdateUserPassword,
// } = require("../Resuble/UsersvalidatorError");

const Routes = Router();

Routes.route("/signup").post(SignupValidator, SingUp);
Routes.route("/login").post(LoginValidator, Login);
Routes.post("/forgetPassword", forgetPassword);
Routes.post("/restCode", restCodeSent);
Routes.put("/restNewPassword", restNewPassword("password"));
// Routes.route("/:id")
//   .get(getOneUserValidator, getUser)
//   .put(uploadImage,resizeImageUsers,updateOneUserValidator, updateUser)
//   .delete(deleteOneUserValidator, deleteUser);
module.exports = Routes;
