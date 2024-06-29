const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const ApiError = require("../Resuble/ApiErrors");
const FeatureApi = require("../Utils/Feature");
const path = require("path");
const fs = require("fs");
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
    const deleteDoc = await Model.findById(req.params.id);
    const baseUrl = `${process.env.BASE_URL}/teacher/`;
    // const relativePathimage = deleteDoc.image.replace(baseUrl, "");
    const relativePathPicture = deleteDoc.picture.replace(baseUrl, "");
    const relativePathAvatar = deleteDoc.avater.replace(baseUrl, "");

    if (!deleteDoc) {
      return next(
        new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
      );
    }
    console.log( relativePathPicture, relativePathAvatar);

    //   // حذف الصورة من ملفات المشروع
    const filePathImage = path.join(
      __dirname,
      "../uploads/teacher",
      relativePathimage
    );
    const filePathPicture = path.join(
      __dirname,
      "../uploads/teacher",
      relativePathPicture
    );
    const filePathAvater = path.join(
      __dirname,
      "../uploads/teacher",
      relativePathAvatar
    );
    //   console.log(filePath);
    const filePaths = [filePathImage, filePathPicture, filePathAvater];
    try {
      // fs.unlink(filePathImage, (err) => {
      //   if (err) {
      //     console.error(" Faild Delete:", err);
      //   } else {
      //     console.log("Delete Is Success in local filesystem");
      //   }
      // });
    const data =  filePaths.map((filePath) => fs.unlink(filePath));
    console.log(data);
    } catch (error) {
      console.error("No Delete", error);
    }
    // deleteDoc.remove();
    res.status(200).json({ message: "Delete Success", data: deleteDoc });
  });
exports.updateOne = (Model) =>
  expressAsyncHandler(async (req, res, next) => {
    const updateDocById = await Model.findByIdAndUpdate(
      req.params.id,
      req.body.image === "" ? { $set: { name: req.body.name } } : req.body,

      { new: true }
    );

    if (!updateDocById)
      next(
        new ApiError(
          `Sorry Can't Update This ID From ID :${req.params.id}`,
          404
        )
      );
    updateDocById.save();
    res.status(200).json({ data: updateDocById });
  });
