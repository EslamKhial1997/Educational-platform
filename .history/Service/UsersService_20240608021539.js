// const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendCode = require("../Utils/SendCodeEmail");
const jwt = require("jsonwebtoken");
// const sharp = require("sharp");
// const { v4: uuidv4 } = require("uuid");
// const { UploadSingleImage } = require("../Middleware/UploadImageMiddleware");
const factory = require("./FactoryHandler");

const createUsersModel = require("../Modules/createUsers");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../Resuble/ApiErrors");

// const ApiError = require("../Resuble/ApiErrors");

// exports.uploadImage = UploadSingleImage("imageProfile");
// exports.resizeImageUsers = expressAsyncHandler(async (req, res, next) => {
//   if (req.file) {
//     const imageProfileName = `imageProfile-${uuidv4()}-${Date.now()}.jpeg`;
//     await sharp(req.file.buffer)
//       .resize(2000, 1333)
//       .toFormat("jpeg")
//       .jpeg({ quality: 95 })
//       .toFile(`uploads/users/${imageProfileName}`);
//     req.body.imageProfile = imageProfileName;
//   }

//   next();
// });

exports.createUsers = expressAsyncHandler(async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 12);
  const user = await createUsersModel.create(req.body);
  const digitCode = Math.floor(100000 + Math.random() * 900000).toString();
  const ciphertext = crypto
    .createHash("sha256")
    .update(digitCode)
    .digest("hex");

  user.code = ciphertext;
  user.codeExpires = Date.now() + 10 * 60 * 1000;

  // try {
  await sendCode({
    subject: "Your Password Rest Code invalid For 10 mins",
    email: user.email,
    digitCode,
  });
  await user.save();
  res.status(200).json({
    status: "success",
    massage: "Rest Code Sent successfully",
    data: user,
  });
});
exports.verifyRegister = expressAsyncHandler(async (req, res, next) => {
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
  user.code = undefined;
  user.codeExpires = undefined;
  await user.save();
  res.status(200).json({ status: "success" });
});
exports.getUsers = factory.getAll(createUsersModel);
exports.getUser = factory.getOne(createUsersModel);
// exports.updateUser = expressAsyncHandler(async (req, res, next) => {
//   const updateDocById = await createUsersModel.findByIdAndUpdate(
//     req.params.id,
//     {
//       name: req.body.name,
//       slug: req.body.name,
//       email: req.body.email,
//       imageProfile: req.body.imageProfile,
//       phone: req.body.phone,
//       role: req.body.role,
//       status: req.body.status,
//       passwordDB: req.body.passwordDB,
//     },
//     {
//       new: true,
//     }
//   );
//   if (!updateDocById)
//     next(
//       new ApiError(`Sorry Can't Update This ID From ID :${req.params.id}`, 404)
//     );
//   res.status(200).json({ data: updateDocById });
// });
// exports.deleteUser = factory.deleteOne(createUsersModel);

exports.updatePassword = expressAsyncHandler(async (req, res, next) => {
  const updateDocById = await createUsersModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
    },
    {
      new: true,
    }
  );
  if (!updateDocById)
    next(
      new ApiError(`Sorry Can't Update Password From ID :${req.params.id}`, 404)
    );
  res.status(200).json({ data: updateDocById });
});
exports.getLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
exports.updateLoggedUserPassword = expressAsyncHandler(async (req, res) => {
  const user = await createUsersModel.findByIdAndUpdate(
    req.params.,
    {
      password: await bcrypt.hash(req.body.password, 12),
    },
    {
      new: true,
    }
  );
  const token = jwt.sign({ userId: user._id }, process.env.DB_URL, {
    expiresIn: "90d",
  });
  console.log(user);
  res.status(200).json({ data: user, token });
});
// exports.updateLoggedUserData = expressAsyncHandler(async (req, res, next) => {
//   const updatedUser = await createUsersModel.findByIdAndUpdate(
//     req.user._id,
//     {
//       name: req.body.name,
//       phone: req.body.phone,
//       imageProfile: req.body.imageProfile,
//     },
//     { new: true }
//   );

//   res.status(200).json({ data: updatedUser });
// });
// exports.deleteLoggedUserData = expressAsyncHandler(async (req, res, next) => {
//   await createUsersModel.findByIdAndUpdate(req.user._id, { active: false });

//   res.status(204).json({ status: "Success" });
// });

// exports.updateUserRole = expressAsyncHandler(async (req, res, next) => {
//   const user = await createUsersModel.findByIdAndUpdate(
//     req.params.id,
//     {
//       role: req.body.role,
//     },
//     {
//       new: true,
//     }
//   );
//   if (!user) {
//     return next(new ApiError(`User ${req.params.id} Not Found`));
//   }

//   res.status(200).json({ data: user });
// });
// exports.updateUserStatus = expressAsyncHandler(async (req, res, next) => {
//   const user = await createUsersModel.findByIdAndUpdate(
//     req.params.id,
//     {
//       status: req.body.status,
//     },
//     {
//       new: true,
//     }
//   );
//   if (!user) {
//     return next(new ApiError(`User ${req.params.id} Not Found`));
//   }

//   res.status(200).json({ data: user });
// });
