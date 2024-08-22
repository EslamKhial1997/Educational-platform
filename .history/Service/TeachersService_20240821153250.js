const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const factory = require("./FactoryHandler");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../Resuble/ApiErrors");
const { UploadMultiImage } = require("../Middleware/UploadImageMiddleware");
const createTeachersModel = require("../Modules/createTeacher");
const createClassModel = require("../Modules/createClasses");
const createSectionModel = require("../Modules/createSection");
const createGalleryModel = require("../Modules/createGallary");
const createLecturesModel = require("../Modules/createAlecture");

exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  if (req.files.image) {
    const imageType = req.files?.image[0].mimetype.split("image/")[1];

    const filename = `image-${uuidv4()}-${Date.now()}.${
      imageType ? imageType : "jpeg"
    }`;
    await sharp(req.files.image[0].buffer)
      .resize(750, 750)
      .toFormat(imageType)
      .toFile(`uploads/teacher/${filename}`);
    req.body.image = filename;
  }
  if (req.files.picture) {
    const imageType = req.files.picture[0].mimetype.split("image/")[1];

    const filename = `picture-${uuidv4()}-${Date.now()}.${
      imageType ? imageType : "jpeg"
    }`;
    await sharp(req.files.picture[0].buffer)
      .resize(750, 750)
      .toFormat(imageType)
      .jpeg({ quality: 50 })
      .toFile(`uploads/teacher/${filename}`);
    req.body.picture = filename;
  }
  if (req.files.avater) {
    const imageType = req.files.avater[0].mimetype.split("image/")[1];

    const filename = `avater-${uuidv4()}-${Date.now()}.${
      imageType ? imageType : "jpeg"
    }`;
    await sharp(req.files.avater[0].buffer)
      .resize(500, 750)
      .toFormat(imageType)
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
exports.getAllDataTeacher = expressAsyncHandler(async (req, res, next) => {
  const teacher = await createTeachersModel.findById(req.params.id);
  const gallery = await createGalleryModel.find({
    teacher: req.params.id,
  });
  const classes = await createClassModel.find({
    teacher: req.params.id,
  });
  const section = await createSectionModel.find({
    class: { $in: classes.map((cls) => cls._id) },
  });
  const lecutre = await createLecturesModel.find({
    section: { $in: section.map((cls) => cls._id) },
  });
  res.status(201).json({
    data: {
      teacher,
      gallery,
      classes,
      section,
      lecutre,
    },
  });
});
exports.getTeacher = factory.getOne(createTeachersModel);
exports.updateTeacher = factory.updateOne(createTeachersModel, "teacher");
exports.deleteTeacher = factory.deleteOne(createTeachersModel, "teacher");
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
exports.getMeTeacher = factory.getOne(createTeachersModel);

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
exports.updateSpecificPaid = expressAsyncHandler(async (req, res, next) => {
  // العثور على المعلم والدفعة لتحديد النقاط قبل الحذف
  const teacher = await createTeachersModel.findOne(
    { _id: req.user._id, "paid._id": req.params.id },
    { "paid.$": 1 } // استرجاع الدفعة المحددة فقط
  );


  if (!teacher) {
    return next(new ApiError("لم يتم العثور على المعلم أو الدفعة", 404));
  }

  const pointsToDelete = teacher.paid[0].point; // حفظ النقاط التي سيتم حذفها

  // حذف الدفعة
  const updatedTeacher = await createTeachersModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: { paid: { _id: req.params.paid } }, // حذف الدفعة من مصفوفة `paid`
    },
    { new: true }
  );

  if (!updatedTeacher) {
    return next(new ApiError("لم يتم تحديث المعلم بعد حذف الدفعة", 500));
  }

  // تعديل النقاط المتبقية للمعلم
  updatedTeacher.point -= pointsToDelete;

  // حفظ التحديثات
  await updatedTeacher.save();

  res.status(200).json({
    status: "success",
    data: updatedTeacher,
  });
});

