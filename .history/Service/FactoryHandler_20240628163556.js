const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const ApiError = require("../Resuble/ApiErrors");
const FeatureApi = require("../Utils/Feature");
const path = require("path");

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
    log
  //  const baseUrl = `${process.env.BASE_URL}/teacher`;
  //     const relativePathimage = deleteDoc.image.replace(baseUrl, "" + deleteDoc.image);
  //     const relativePathPicture = deleteDoc.picture.replace(baseUrl, "" + deleteDoc.picture);
  //     const relativePathAvatar = deleteDoc.avater.replace(baseUrl, "" + deleteDoc.avater);
  //   if (!deleteDoc) {
  //     return next(
  //       new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
  //     );
  //   }
  //   const deleteFile = (filePath) => {
  //     if (fs.existsSync(filePath)) {
  //       fs.unlinkSync(filePath);
  //     }
  //   };
  //   console.log(relativePathAvatar);
  //  try {
  //   deleteFile(path.resolve(relativePathimage));
  //   deleteFile(path.resolve(relativePathPicture));
  //   deleteFile(path.resolve(relativePathAvatar));
  //   console.log("Deletes File");
  //  } catch (error) {
  //   console.log(" no Deletes File");
  //  }
    // try {
    //   const baseUrl = `${process.env.BASE_URL}/teacher`;
    //   const relativePath = url.replace(baseUrl, "" + deleteDoc.image);
    //   // حذف الصورة من ملفات المشروع
    //   const filePath = path.join(__dirname, "../uploads/teacher", relativePath);
    //   console.log(filePath);
    //   fs.unlink(filePath, (err) => {
    //     if (err) {
    //       console.error(" Faild Delete:", err);
    //     } else {
    //       console.log("Delete Is Success in local filesystem");
    //     }
    //   });
    // } catch (error) {
    //   console.error("حدث خطأ أثناء الحذف:", error);
    // }
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
