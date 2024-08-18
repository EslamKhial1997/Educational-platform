
const factory = require("./FactoryHandler");
const ApiError = require("../Resuble/ApiErrors");
const {  filePathImage } = require("../Utils/imagesHandler");
const expressAsyncHandler = require("express-async-handler");
const createHonorModel = require("../Modules/createHonor");
exports.createHonor = factory.createOne(createHonorModel);
exports.getHonors = factory.getAll(createHonorModel);
exports.getHonor = factory.getOne(createHonorModel);
exports.updateHonor =factory.updateOne(createHonorModel , "honor")
// expressAsyncHandler(async (req, res, next) => {
//   try {
//     const baseUrl = `${process.env.BASE_URL}/honor/`;

//     // العثور على الجاليري بناءً على ID
//     const findHonor = await createHonorModel.findById(req.params.id);

//     if (!findHonor) {
//       return next(
//         new ApiError(
//           `Sorry, can't find the document with ID: ${req.params.id}`,
//           404
//         )
//       );
//     }

//     // تحديث البيانات بناءً على ما إذا كانت الصورة فارغة
//     const updateData =
//       req.body.image === "" ? { name: req.body.name } : req.body;

//     // تحديث المستند بناءً على ID
//     const updateDocById = await createHonorModel.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     if (!updateDocById) {
//       return next(
//         new ApiError(
//           `Sorry, can't update the document with ID: ${req.params.id}`,
//           404
//         )
//       );
//     }

//     // التحقق مما إذا كانت الصورة القديمة مختلفة عن الصورة الجديدة
//     if (
//       findHonor.image &&
//       req.body.image &&
//       findHonor.image !== req.body.image
//     ) {
//       const relativePathImage = findHonor.image.split(baseUrl)[1];
//       filePathImage("honor", relativePathImage); // حذف الصورة القديمة
//     }

//     // تحديث مسار الصورة إذا تم توفيرها
//     if (req.body.image) {
//       updateDocById.image = req.body.image;
//       await updateDocById.save();
//     }

//     res.status(200).json({ data: updateDocById });
//   } catch (error) {
//     next(error);
//   }
// });

exports.deleteHonor = expressAsyncHandler(async (req, res, next) => {
  const deleteDoc = await createHonorModel.findByIdAndDelete(req.params.id);
  const baseUrl = `${process.env.BASE_URL}/honor/`;

  if (!deleteDoc) {
    return next(
      new ApiError(`Sorry Can't Delete This ID :${req.params.id}`, 404)
    );
  }
  if (deleteDoc.image) {
    const relativePathimage = deleteDoc.image.replace(baseUrl, "");
    filePathImage("Honor", relativePathimage);
  }
  res.status(200).json({ message: "Delete Success", data: deleteDoc });
});
