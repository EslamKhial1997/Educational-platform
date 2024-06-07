const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const createUsersModel = require("../modules/createUsers");
const ApiError = require("../Resuble/ApiErrors");
const sendCode = require("../Utils/SendCodeEmail");

exports.SingUp = expressAsyncHandler(async (req, res) => {
  const createAuth = await createUsersModel.create({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 12),
    passwordConfirm: await bcrypt.hash(req.body.passwordConfirm, 12),
  });
  const token = jwt.sign({ userId: createAuth._id }, process.env.SECRET_KEY, {
    expiresIn: "90d",
  });
  res.status(201).json({ data: createAuth, token });
});
exports.Login = expressAsyncHandler(async (req, res, next) => {
  const user = await createUsersModel.findOne({
    email: req.body.email,
  });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("InCorrect password Or Email"));
  }
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "90d",
  });
  res.status(200).json({ data: user, token });
});
exports.allowedTo = (...roles) =>
  expressAsyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });
exports.protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    next(new ApiError("Invalid authorization please login", 401));
  }

  const verify = jwt.verify(token, process.env.SECRET_KEY);
  const currentUser = await createUsersModel.findById(verify.userId);
  if (!currentUser) {
    next(new ApiError("User Not exist", 401));
  }

  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > jwt.decode.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }
  req.user = currentUser;

  next();
});
exports.forgetPassword = expressAsyncHandler(async (req, res, next) => {
  const user = await createUsersModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(`This Email ${req.body.email} Not Exist `));
  }
  const digitCode = Math.floor(100000 + Math.random() * 900000).toString();
  const ciphertext = crypto
    .createHash("sha256")
    .update(digitCode)
    .digest("hex");

  user.passwordResthashedCode = ciphertext;
  user.passwordRestExpires = Date.now() + 10 * 60 * 1000;
  user.passwordRestVerify = true;
  await user.save();

  // try {
  await sendCode({
    subject: "Your Password Rest Code invalid For 10 mins",
    email: user.email,
    digitCode,
  });
  // } catch (error) {
  //   user.passwordResthashedCode = undefined;
  //   user.passwordRestExpires = undefined;
  //   user.passwordRestVerify = undefined;
  //   await user.save();
  //   return next(new ApiError("There is an error in sending email", 500));
  // }
  res
    .status(200)
    .json({ status: "success", massage: "Rest Code Sent successfully" });
});
exports.restCodeSent = expressAsyncHandler(async (req, res, next) => {
  const restcode = req.body.restCode.toString();
  const ciphertext = crypto.createHash("sha256").update(restcode).digest("hex");
  const user = await createUsersModel.findOne({
    passwordResthashedCode: ciphertext,
    passwordRestExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Rest Code is Invalid Or Expired"));
  }
  user.passwordRestVerify = true;
  await user.save();
  res.status(200).json({ status: "success" });
});
exports.restNewPassword = (UserPassword) =>
  expressAsyncHandler(async (req, res, next) => {
    const user = await createUsersModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return next(
        new ApiError(`There is no user with email ${req.body.email}`, 404)
      );
    }

    // 2) Check if reset code verified
    if (!user.passwordRestVerify) {
      return next(new ApiError("Reset code not verified", 400));
    }
    if (UserPassword === "password") {
      user.password = await bcrypt.hash(req.body.restNewPassword, 12);
    } else if (UserPassword === "passwordDB") {
      user.passwordDB = await bcrypt.hash(req.body.restNewPassword, 12);
    }

    user.passwordResthashedCode = undefined;
    user.passwordRestExpires = undefined;
    user.passwordRestVerify = undefined;

    await user.save();
    if (UserPassword === "password") {
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: "90d",
      });
      res.status(200).json({ token });
    }
    res.status(200).json({ status: "success" });
  });
