const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendCode = require("../Utils/SendCodeEmail");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const path = require("path");
const ApiError = require("../Resuble/ApiErrors");
const { fsRemove } = require("../Utils/imagesHandler");
const factory = require("./FactoryHandler");
const createUsersModel = require("../Modules/createUsers");
const { UploadSingleImage } = require("../Middleware/UploadImageMiddleware");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
exports.resizeImage = (type) =>
  expressAsyncHandler(async (req, res, next) => {
 
    const imageType = req.file.mimetype.split("image/")[1];
    if (req.file) {
      const filename = `${type}-${uuidv4()}-${Date.now()}.${imageType ? imageType :"jpeg"}`;
      await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 70 })
        .toFile(`uploads/${type}/${filename}`);
      req.body.image = filename;
    }
    next();
  });

exports.uploadImage = UploadSingleImage("image");
exports.fsRemove = async (filePath) => {
    if (!filePath) return
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
exports.getUser = factory.getOne(createUsersModel);


// exports.updateUserPoint = expressAsyncHandler(async (req, res, next) => {
//   const updateDocById = await createUsersModel.findById(req.params.id);
//   const userLogged = await createUsersModel.findById(req.user._id);
//   if (updateDocById.role === "user" && req.user.role === "manager") {
//     return Promise.reject(new Error("Sorry You Not Allowed To Update Points"));
//   }
//   if (req.user.role === "manager" && req.user.point < req.body.point) {
//     return Promise.reject(
//       new Error(`Sorry Your Points ${req.user.point} > ${req.body.point}`)
//     );
//   }
//   if (req.user.role === "admin" && req.user.point < req.body.point) {
//     return Promise.reject(
//       new Error(`Sorry Your Points ${req.user.point} > ${req.body.point}`)
//     );
//   }
//   if (!updateDocById)
//     next(
//       new ApiError(`Sorry Can't Update This ID From ID :${req.params.id}`, 404)
//     );
//     userLogged.point = +req.user.point - +req.body.point;
//   console.log(userLogged.point);
//   const totalPoint = +req.body.point + +updateDocById.point;
//   updateDocById.point = totalPoint;
//   await userLogged.history.push({
//     from:userLogged.email,
//     to: updateDocById.email,
//     point: req.body.point,
//     history: Date.now(),
//   });
//   await updateDocById.history.push({
//     from: userLogged.email,
//     to: updateDocById.email,
//     point: req.body.point,
//     history: Date.now(),
//   });

//   await userLogged.save();
//   await updateDocById.save();
//   res.status(200).json({ data: updateDocById });
// });
exports.deleteUser =expressAsyncHandler(async (req, res, next) => {
  const deleteDoc = await createUsersModel.findByIdAndDelete(req.params.id);
  const baseUrl = `${process.env.BASE_URL}/admin/`;

  if (!deleteDoc) {
    return next(
      new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
    );
  }
  if (deleteDoc.image) {
    const relativePathimage = deleteDoc.image.replace(baseUrl, "");
    const filePathImage = path.join(
      __dirname,
      "../uploads/admin",
      relativePathimage
    );
    fsRemove(filePathImage);
  }
  res.status(200).json({ message: "Delete Success", data: deleteDoc });
});


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
exports.updateUser = factory.updateOne(createUsersModel)
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
