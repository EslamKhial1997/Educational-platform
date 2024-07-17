const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendCode = require("../Utils/SendCodeEmail");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
// const { UploadSingleImage } = require("../Middleware/UploadImageMiddleware");
const factory = require("./FactoryHandler");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../Resuble/ApiErrors");
const { UploadMultiImage } = require("../Middleware/UploadImageMiddleware");
const createTeachersModel = require("../Modules/createTeacher");

// const ApiError = require("../Resuble/ApiErrors");

exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  if (req.files.image) {
    const imageType = req.files.image.mimetype.split("image/")[1];

    const filename = `image-${uuidv4()}-${Date.now()}.${
      imageType ? imageType : "jpeg"
    }`;
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
exports.createTeachers = expressAsyncHandler(async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 12);
  const teacher = await createTeachersModel.create(req.body);

  await teacher.save();
  res.status(200).json({
    status: "success",
    data: teacher,
  });
});

exports.getTeachers = factory.getAll(createTeachersModel);
exports.getTeacher = factory.getOne(createTeachersModel);
exports.updateTeacher = factory.updateOne(createTeachersModel);
exports.deleteTeacher = factory.deleteOne(createTeachersModel);
exports.updateTeacherPoint = expressAsyncHandler(async (req, res, next) => {
  const updateDocById = await createTeachersModel.findById(req.params.id);
  const TeacherLogged = await createTeachersModel.findById(req.Teacher._id);
  if (updateDocById.role === "Teacher" && req.Teacher.role === "manager") {
    return Promise.reject(new Error("Sorry You Not Allowed To Update Points"));
  }
  if (req.Teacher.role === "manager" && req.Teacher.point < req.body.point) {
    return Promise.reject(
      new Error(`Sorry Your Points ${req.Teacher.point} > ${req.body.point}`)
    );
  }
  if (req.Teacher.role === "admin" && req.Teacher.point < req.body.point) {
    return Promise.reject(
      new Error(`Sorry Your Points ${req.Teacher.point} > ${req.body.point}`)
    );
  }
  if (!updateDocById)
    next(
      new ApiError(`Sorry Can't Update This ID From ID :${req.params.id}`, 404)
    );
  TeacherLogged.point = +req.Teacher.point - +req.body.point;

  const totalPoint = +req.body.point + +updateDocById.point;
  updateDocById.point = totalPoint;
  await TeacherLogged.history.push({
    from: TeacherLogged.email,
    to: updateDocById.email,
    point: req.body.point,
    history: Date.now(),
  });
  await updateDocById.history.push({
    from: TeacherLogged.email,
    to: updateDocById.email,
    point: req.body.point,
    history: Date.now(),
  });

  await TeacherLogged.save();
  await updateDocById.save();
  res.status(200).json({ data: updateDocById });
});

exports.getLoggedTeacherData = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.Teacher._id;
  next();
});
exports.updateLoggedTeacherPassword = expressAsyncHandler(async (req, res) => {
  const Teacher = await createTeachersModel.findByIdAndUpdate(
    req.Teacher._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
    },
    {
      new: true,
    }
  );
  const token = jwt.sign({ TeacherId: Teacher._id }, process.env.DB_URL, {
    expiresIn: "90d",
  });
  console.log(Teacher);
  res.status(200).json({ data: Teacher, token });
});
// exports.updateLoggedTeacherData = expressAsyncHandler(async (req, res, next) => {
//   const updatedTeacher = await createTeachersModel.findByIdAndUpdate(
//     req.Teacher._id,
//     {
//       name: req.body.name,
//       phone: req.body.phone,
//       imageProfile: req.body.imageProfile,
//     },
//     { new: true }
//   );

//   res.status(200).json({ data: updatedTeacher });
// });
// exports.deleteLoggedTeacherData = expressAsyncHandler(async (req, res, next) => {
//   await createTeachersModel.findByIdAndUpdate(req.Teacher._id, { active: false });

//   res.status(204).json({ status: "Success" });
// });

// exports.updateTeacherRole = expressAsyncHandler(async (req, res, next) => {
//   const Teacher = await createTeachersModel.findByIdAndUpdate(
//     req.params.id,
//     {
//       role: req.body.role,
//     },
//     {
//       new: true,
//     }
//   );
//   if (!Teacher) {
//     return next(new ApiError(`Teacher ${req.params.id} Not Found`));
//   }

//   res.status(200).json({ data: Teacher });
// });
// exports.updateTeacherStatus = expressAsyncHandler(async (req, res, next) => {
//   const Teacher = await createTeachersModel.findByIdAndUpdate(
//     req.params.id,
//     {
//       status: req.body.status,
//     },
//     {
//       new: true,
//     }
//   );
//   if (!Teacher) {
//     return next(new ApiError(`Teacher ${req.params.id} Not Found`));
//   }

//   res.status(200).json({ data: Teacher });
// });
