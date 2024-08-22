const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendCode = require("../Utils/SendCodeEmail");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../Resuble/ApiErrors");
const factory = require("./FactoryHandler");
const createUsersModel = require("../Modules/createUsers");
const { UploadSingleImage } = require("../Middleware/UploadImageMiddleware");
const fs = require("fs");

exports.uploadImage = UploadSingleImage("image");
exports.fsRemove = async (filePath) => {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(" Faild Delete:", err);
    } else {
      console.log("Delete Is Success in local filesystem");
    }
  });
};

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
exports.getUser = (model) => factory.getOne(model);
exports.deleteUser = factory.deleteOne(createUsersModel, "admin");

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
exports.updateUser = factory.updateOne(createUsersModel, "admin");
exports.paidToTeacher = expressAsyncHandler(async (req, res, next) => {
  const teacher = await createUsersModel.findById(
    req.body.id,

  );
if (condition) {
    res.status(200).json({ data: user });
}
});
