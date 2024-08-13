const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const os = require("os");

const ApiError = require("../Resuble/ApiErrors");
const sendCode = require("../Utils/SendCodeEmail");
const createUsersModel = require("../Modules/createUsers");

const { default: Mongoose } = require("mongoose");
exports.createFirstManegerAccount = async () => {
  if (await createUsersModel.findOne({ name: "manager" })) return;
  const manager = await createUsersModel.create({
    name: "manager",
    email: "manager@gmail.com",
    phone: "01000000000",
    userVerify: true,
    role: "manager",
    password: await bcrypt.hash("123456789", 12),
    confirmPassword: await bcrypt.hash("123456789", 12),
  });

  console.log("Manager account created successfully");
};
exports.SingUp = expressAsyncHandler(async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 12);
  const user = await createUsersModel.create(req.body);
  const digitCode = Math.floor(100000 + Math.random() * 900000).toString();
  const ciphertext = crypto
    .createHash("sha256")
    .update(digitCode)
    .digest("hex");

  user.code = ciphertext;
  user.codeExpires = Date.now() + 10 * 60 * 1000;
  try {
    await sendCode(user.email, digitCode);

    const token = jwt.sign({ userId: user._id }, process.env.DB_URL, {
      expiresIn: "90d",
    });
    await user.save();
    res.status(200).json({
      status: "success",
      massage: "Rest Code Sent successfully",
      data: user,
      token,
    });
  } catch (error) {
    return next(new ApiError("Somthing failed"));
  }
  // try {
});


exports.Login = expressAsyncHandler(async (req, res, next) => {
  const userAgent = req.useragent;
  const hostname = os.hostname();
 
  
  const operatingSystem = {
    id:new Mongoose.Types.ObjectId,
    borwser: userAgent.browser,
    platform: userAgent.platform,
    source: userAgent.source,
    version: userAgent.version,
    os: userAgent.os,
    pc:hostname,
    data:new Date(Date.now()),
  };


  
  const user = await createUsersModel.findOne({
    email: req.body.email,
  });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    res.status(500).json({
      status: "Error",
      massage: "Incorrect password Or Email",
    });
  }
  user.operatingSystem.push(operatingSystem);
  await user.save();
  const token = jwt.sign({ userId: user._id }, process.env.DB_URL, {
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
        res.status(403).json({
          status: "Error",
          massage: "You are not allowed to access this route",
        })
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
    next(
      res.status(200).json({
        statusCode: "Error",
        message: "Invalid token Please Login Again",
        status: 401,
      })
    );
  }

  const verify = jwt.verify(token, process.env.DB_URL);
  const currentUser = await createUsersModel.findById(verify.userId);
  if (!currentUser) {
    next(
      res.status(200).json({
        statusCode: "Error",
        message: "User Not Found",
        status: 401,
      })
    );
  }
  if (!verify) {
    next(
      res.status(200).json({
        statusCode: "Error",
        message: "Invalid token Please Login Again",
        status: 401,
      })
    );
  }

  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > jwt.decode.iat) {
      return next(
        res.status(200).json({
          statusCode: "Error",
          message: "User recently changed his password. please login again..",
          status: 401,
        })
      );
    }
  }
  req.user = currentUser;

  next();
});
exports.resendCodeVerify = expressAsyncHandler(async (req, res, next) => {
  const email = req.user.email;
  const user = await createUsersModel.findOne({ email: email });
  if (!user) {
    return next(new ApiError(`This Email ${email} Not Exist `));
  }
  const digitCode = Math.floor(100000 + Math.random() * 900000).toString();
  const ciphertext = crypto
    .createHash("sha256")
    .update(digitCode)
    .digest("hex");

  user.code = ciphertext;
  user.codeExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendCode(user.email, digitCode);
  res
    .status(200)
    .json({ status: "success", massage: "Rest Code Sent successfully" });
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

  user.code = ciphertext;
  user.codeExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendCode(user.email, digitCode);
  res
    .status(200)
    .json({ status: "success", massage: "Rest Code Sent successfully" });
});
exports.restCodeSent = expressAsyncHandler(async (req, res, next) => {
  const restcode = req.body.code.toString();
  const ciphertext = crypto.createHash("sha256").update(restcode).digest("hex");
  const user = await createUsersModel.findOne({
    code: ciphertext,
    codeExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Rest Code is Invalid Or Expired"));
  }
  user.userVerify = true;
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
    if (!user.userVerify) {
      return next(new ApiError("Reset code not verified", 400));
    }
    if (UserPassword === "password") {
      user.password = await bcrypt.hash(req.body.setNewPassword, 12);
    }

    user.code = undefined;
    user.codeExpires = undefined;
    user.userVerify = true;

    await user.save();
    if (UserPassword === "password") {
      const token = jwt.sign({ userId: user._id }, process.env.DB_URL, {
        expiresIn: "90d",
      });
      res.status(200).json({ token });
    }
    res.status(200).json({ status: "success" });
  });
