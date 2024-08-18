const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const ApiError = require("../Resuble/ApiErrors");
const FeatureApi = require("../Utils/Feature");
const path = require("path");

const { fsRemove, filePathImage } = require("../Utils/imagesHandler");
const createTransactionModel = require("../Modules/createtransaction");

exports.createOne = (Model) =>
  expressAsyncHandler(async (req, res) => {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 12);
    }
    if (req.body.passwordDB) {
      req.body.passwordDB = await bcrypt.hash(req.body.passwordDB, 12);
    }
    const createDoc = await Model.create(req.body);
    res.status(201).json({ data: createDoc });
  });
exports.getAll = (Model, keyword) =>
  expressAsyncHandler(async (req, res) => {
    let fillter = {};
    if (req.filterObject) {
      fillter = req.filterObject;
    }

    const countDocs = await Model.countDocuments();
    const ApiFeatures = new FeatureApi(Model.find(fillter), req.query)
      .Fillter(Model)
      .Sort()
      .Fields()
      .Search(keyword)
      .Paginate(countDocs);
    const { MongooseQueryApi, PaginateResult } = ApiFeatures;
    const getDoc = await MongooseQueryApi;
    res
      .status(201)
      .json({ results: getDoc.length, PaginateResult, data: getDoc });
  });
exports.getMyTransaction = (Model, keyword) =>
  expressAsyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }

    const countDocs = await Model.countDocuments();
    const ApiFeatures = new FeatureApi(
      Model.find({
        $or: [{ "sender.id": req.user._id }, { "receiver.id": req.user._id }],
      }),
      req.query
    )
      .Fillter(Model)
      .Sort()
      .Fields()
      .Search(keyword)
      .Paginate(countDocs);

    const { MongooseQueryApi, PaginateResult } = ApiFeatures;
    const getDoc = await MongooseQueryApi;

    // حساب مجموع النقاط باستخدام aggregate
    const totalPoints = await Model.aggregate([
      {
        $match: {
          $or: [{ "sender.id": req.user._id }, { "receiver.id": req.user._id }],
        },
      },
      { $group: { _id: null, total: { $sum: "$pointsSent" } } },
    ]);

    const total = totalPoints.length > 0 ? totalPoints[0].total : 0;

    res.status(201).json({
      results: getDoc.length,
      PaginateResult,
      data: getDoc,
      totalPoints: total, // إضافة مجموع النقاط إلى الاستجابة
    });
  });

exports.getOne = (Model, populateOpt) =>
  expressAsyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOpt) {
      query = query.populate(populateOpt);
    }
    const getDocById = await query;
    if (!getDocById)
      next(
        new ApiError(`Sorry Can't get This ID From ID :${req.params.id}`, 404)
      );
    res.status(200).json({ data: getDocById });
  });

exports.deleteOne = (Model) =>
  expressAsyncHandler(async (req, res, next) => {
    const deleteDoc = await Model.findByIdAndDelete(req.params.id);
    const baseUrl = `${process.env.BASE_URL}/teacher/`;

    if (!deleteDoc) {
      return next(
        new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
      );
    }
    if (deleteDoc.image) {
      const relativePathimage = deleteDoc.image.replace(baseUrl, "");
      const filePathImage = path.join(
        __dirname,
        "../uploads/teacher",
        relativePathimage
      );
      fsRemove(filePathImage);
    }
    if (deleteDoc.picture) {
      const relativePathPicture = deleteDoc.picture.replace(baseUrl, "");
      const filePathPicture = path.join(
        __dirname,
        "../uploads/teacher",
        relativePathPicture
      );
      fsRemove(filePathPicture);
    }
    if (deleteDoc.avater) {
      const relativePathAvatar = deleteDoc.avater.replace(baseUrl, "");
      const filePathAvater = path.join(
        __dirname,
        "../uploads/teacher",
        relativePathAvatar
      );
      fsRemove(filePathAvater);
    }
    res.status(200).json({ message: "Delete Success", data: deleteDoc });
  });
exports.updateOne = (Model, filePath) =>
  expressAsyncHandler(async (req, res, next) => {
    try {
      const baseUrl = `${process.env.BASE_URL}/${filePath}/`;

      // العثور على الجاليري بناءً على ID
      const findGallery = await Model.findById(req.params.id);

      if (!findGallery) {
        return next(
          new ApiError(
            `Sorry, can't find the document with ID: ${req.params.id}`,
            404
          )
        );
      }

      // تحديث البيانات بناءً على ما إذا كانت الصورة فارغة

      // تحديث المستند بناءً على ID
      const updateDocById = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updateDocById) {
        return next(
          new ApiError(
            `Sorry, can't update the document with ID: ${req.params.id}`,
            404
          )
        );
      }

      // التحقق مما إذا كانت الصورة القديمة مختلفة عن الصورة الجديدة
      if (
        findGallery.image &&
        req.body.image &&
        findGallery.image !== req.body.image ||  findGallery.avater &&
        req.body.avater &&
        findGallery.avater !== req.body.avater ||findGallery.picture &&
        req.body.avater &&
        findGallery.avater !== req.body.avater
      ) {
        const relativePathImage = findGallery.image.split(baseUrl)[1];
        filePathImage(filePath, relativePathImage); // حذف الصورة القديمة
      }

      // تحديث مسار الصورة إذا تم توفيرها
      if (req.body.image) {
        updateDocById.image = req.body.image;
        await updateDocById.save();
      }

      res.status(200).json({ data: updateDocById });
    } catch (error) {
      next(error);
    }
  });
//expressAsyncHandler(async (req, res, next) => {
//   const updateDocById = await Model.findByIdAndUpdate(
//     req.params.id,
//     req.body.image === "" ? { $set: { name: req.body.name } } : req.body,

//     { new: true }
//   );

//   if (!updateDocById)
//     next(
//       new ApiError(
//         `Sorry Can't Update This ID From ID :${req.params.id}`,
//         404
//       )
//     );
//   updateDocById.save();
//   res.status(200).json({ data: updateDocById });
// });
