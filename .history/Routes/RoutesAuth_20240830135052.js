const { Router } = require("express");

const { LoginValidator } = require("../Resuble/AuthvalidatorError");
const {
  SingUp,
  Login,
  forgetPassword,
  restCodeSent,
  restNewPassword,
  resendCodeVerify,
  protect,
} = require("../Service/AuthService");
const { verifyRegister } = require("../Service/UsersService");
const { createUsersValidator } = require("../Resuble/UsersvalidatorError");
const { uploadImage, resizeImageAuth } = require("../Utils/imagesHandler");

const Routes = Router();

Routes.route("/signup").post(
  uploadImage,
  createUsersValidator,
  resizeImageAuth("admin"),
  SingUp
);
Routes.route("/verifycode").post(verifyRegister);
Routes.route("/resendVerifycode").post(protect, resendCodeVerify);
Routes.route("/login").post(LoginValidator, Login);
Routes.post("/forgetPassword",(req, res, next) => {
  const model = req.model;
  forgetPassword(model)(req, res, next);
} );
Routes.post("/restCode", restCodeSent);
Routes.put("/setNewPassword", restNewPassword("password"));
module.exports = Routes;
