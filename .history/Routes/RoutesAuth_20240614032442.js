const { Router } = require("express");

const {
  LoginValidator,
} = require("../Resuble/AuthvalidatorError");
const {
  SingUp,
  Login,
  forgetPassword,
  restCodeSent,
  restNewPassword,
} = require("../Service/AuthService");
const { verifyRegister, UploadImageService } = require("../Service/UsersService");
const { createUsersValidator,getOneUserValidator } = require("../Resuble/UsersvalidatorError");

// const {
//   createUsersValidator,
//   getOneUserValidator,
//   updateOneUserValidator,
//   deleteOneUserValidator,
//   UpdateUserPassword,
// } = require("../Resuble/UsersvalidatorError");

const Routes = Router();

Routes.route("/signup").post(UploadImageService,resize,createUsersValidator, SingUp);
Routes.route("/verifycode").post(verifyRegister);
Routes.route("/login").post(LoginValidator, Login);
Routes.post("/forgetPassword", forgetPassword);
Routes.post("/restCode", restCodeSent);
Routes.put("/setNewPassword", restNewPassword("password"));

//   .put(uploadImage,resizeImageUsers,updateOneUserValidator, updateUser)
//   .delete(deleteOneUserValidator, deleteUser);
module.exports = Routes;
