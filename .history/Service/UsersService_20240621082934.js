const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendCode = require("../Utils/SendCodeEmail");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
// const { UploadSingleImage } = require("../Middleware/UploadImageMiddleware");
const factory = require("./FactoryHandler");

const createUsersModel = require("../Modules/createUsers");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../Resuble/ApiErrors");
const { UploadMultiImage } = require("../Middleware/UploadImageMiddleware");

// const ApiError = require("../Resuble/ApiErrors");

exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  if (req.files.image) {
    const filename = `image-${uuidv4()}-${Date.now()}.png`;
    await sharp(req.files.image[0].buffer)
      .resize(500, 750)
      .toFormat("png")
      .jpeg({ quality: 50 })
      .toFile(`uploads/teacher/${filename}`);
    req.body.image = filename;
  }
  if (req.files.picture) {
    const filename = `picture-${uuidv4()}-${Date.now()}.png`;
    await sharp(req.files.picture[0].buffer)
      .resize(500, 750)
      .toFormat("png")
      .jpeg({ quality: 50 })
      .toFile(`uploads/teacher/${filename}`);
    req.body.picture = filename;
  }
  if (req.files.avater) {
    const filename = `avater-${uuidv4()}-${Date.now()}.png`;
    await sharp(req.files.avater[0].buffer)
      .resize(500, 750)
      .toFormat("png")
      .jpeg({ quality: 50 })
      .toFile(`uploads/teacher/${filename}`);
    req.body.avater = filename;
  }

  next();
});
exports.UploadImageService = UploadMultiImage([
  { name: "image", maxCount: 1 },
  { name: "picture", maxCount: 1 },
  { name: "avater", maxCount: 1 },
]);
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
  await sendCode(user.email, digitCode);
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
exports.updateUserPoint = expressAsyncHandler(async (req, res, next) => {
  const updateDocById = await createUsersModel.findByIdAndUpdate(
    req.params.id,
    {
      point: req.body.point,
    },
    {
      new: true,
    }
  );
  if (updateDocById.role ==="user" , req.user.role ==="manager") {
    next(
      new ApiError(`Sorry No Not Allowrd  :${req.params.id}`, 404)
    );
  }
  if (!updateDocById)
    next(
      new ApiError(`Sorry Can't Update This ID From ID :${req.params.id}`, 404)
    );
  res.status(200).json({ data: updateDocById });
});
// exports.deleteUser = factory.deleteOne(createUsersModel);

exports.getLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
exports.updateLoggedUserPassword = expressAsyncHandler(async (req, res) => {
  const user = await createUsersModel.findByIdAndUpdate(
    req.user._id,
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
