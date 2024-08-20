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
const {
  verifyRegister,
} = require("../Service/UsersService");
const { createUsersValidator } = require("../Resuble/UsersvalidatorError");


const Routes = Router();

Routes.route("/signup")  .post(
  uploadImage,
  createUsersValidator,
  resizeImageAuth("admin"),
  SingUp
)
Routes.route("/verifycode").post(verifyRegister);
Routes.route("/resendVerifycode").post(protect, resendCodeVerify);
Routes.route("/login").post(LoginValidator, Login);
Routes.post("/forgetPassword", forgetPassword);
Routes.post("/restCode", restCodeSent);
Routes.put("/setNewPassword", restNewPassword("password"));
module.exports = Routes;
