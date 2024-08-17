const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const os = require("os");

const ApiError = require("../Resuble/ApiErrors");
const sendCode = require("../Utils/SendCodeEmail");
const createUsersModel = require("../Modules/createUsers");

const mongoose = require("mongoose");
const createTeachersModel = require("../Modules/createTeacher");
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
    id: new mongoose.Types.ObjectId(),
    browser: userAgent.browser,
    platform: userAgent.platform,
    source: userAgent.source,
    version: userAgent.version,
    os: userAgent.os,
    pc: hostname,
    data: new Date(Date.now()),
  };

  let user = await createUsersModel.findOne({ email: req.body.email });
  let teacher = await createTeachersModel.findOne({ email: req.body.email });

  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    user.operatingSystem.push(operatingSystem);
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.DB_URL, {
      expiresIn: "90d",
    });
    return res.status(200).json({ data: user, token });
  } else if (
    teacher &&
    (await bcrypt.compare(req.body.password, teacher.password))
  ) {
    const token = jwt.sign({ userId: teacher._id }, process.env.DB_URL, {
      expiresIn: "90d",
    });
    return res.status(200).json({ data: teacher, token });
  } else {
    return res.status(500).json({
      status: "Error",
      message: "Incorrect password or email",
    });
  }
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
  let user = await createUsersModel.findOne({ email: req.body.email });
  let teacher = await createTeachersModel.findOne({ email: req.body.email });

  if (!user && !teacher) {
    return next(new ApiError(`This Email ${req.body.email} does not exist.`));
  }

  // إنشاء كود رقمي عشوائي
  const digitCode = Math.floor(100000 + Math.random() * 900000).toString();
  const ciphertext = crypto.createHash("sha256").update(digitCode).digest("hex");

  if (user) {
    user.code = ciphertext;
    user.codeExpires = Date.now() + 10 * 60 * 1000; // مدة صلاحية الكود هي 10 دقائق
    await user.save();
  }

  if (teacher) {
    teacher.code = ciphertext;
    teacher.codeExpires = Date.now() + 10 * 60 * 1000; // مدة صلاحية الكود هي 10 دقائق
    await teacher.save();
  }

  // إرسال الرمز للمستخدم أو المعلم
  await sendCode(req.body.email, digitCode);
  res.status(200).json({ status: "success", message: "Reset code sent successfully" });
});
exports.restCodeSent = expressAsyncHandler(async (req, res, next) => {
  const restcode = req.body.code.toString();
  const ciphertext = crypto.createHash("sha256").update(restcode).digest("hex");

  // البحث عن المستخدم أو المعلم بناءً على الكود المشفر وتحقق من صلاحية الكود
  const user = await createUsersModel.findOne({
    code: ciphertext,
    codeExpires: { $gt: Date.now() },
  });

  const teacher = await createTeachersModel.findOne({
    code: ciphertext,
    codeExpires: { $gt: Date.now() },
  });

  if (!user && !teacher) {
    return next(new ApiError("Reset Code is Invalid or Expired"));
  }

  // تحديث حالة التحقق للمستخدم أو المعلم
  if (user) {
    user.userVerify = true;
    await user.save();
  }

  if (teacher) {
    teacher.teacherVerify = true; // يمكنك تعديل اسم الحقل حسب نموذج المعلم
    await teacher.save();
  }

  res.status(200).json({ status: "success" });
});
exports.restNewPassword = (UserPassword) =>
  expressAsyncHandler(async (req, res, next) => {
    const { email, setNewPassword } = req.body;

    // 1) العثور على المستخدم أو المعلم بناءً على البريد الإلكتروني
    const user = await createUsersModel.findOne({ email });
    const teacher = await createTeachersModel.findOne({ email });

    if (!user && !teacher) {
      return next(new ApiError(`There is no user or teacher with email ${email}`, 404));
    }

    const target = user || teacher;

    // 2) التحقق من أن كود الاستعادة تم التحقق منه
    if (!target.userVerify) {
      return next(new ApiError("Reset code not verified", 400));
    }

    // 3) تحديث كلمة المرور إذا كانت العملية تتعلق بكلمة المرور
    if (UserPassword === "password") {
      target.password = await bcrypt.hash(setNewPassword, 12);
    }

    // 4) إزالة الكود ومدة صلاحيته وتحديث حالة التحقق
    target.code = undefined;
    target.codeExpires = undefined;
    target.userVerify = true;

    await target.save();

    // 5) إنشاء وإرجاع رمز JWT إذا كانت العملية تتعلق بكلمة المرور
    if (UserPassword === "password") {
      const token = jwt.sign({ userId: target._id }, process.env.DB_URL, {
        expiresIn: "90d",
      });
      return res.status(200).json({ token });
    }

    res.status(200).json({ status: "success" });
  });
