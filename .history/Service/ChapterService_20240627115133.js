const factory = require("./FactoryHandler");

const createChaptersModel = require("../Modules/createChapter");

exports.createChapters = factory.createOne(createChaptersModel);
exports.getChapters = factory.getAll(createChaptersModel);
// exports.getChapter = factory.getOne(createChaptersModel);
exports.getChapter = async (req, res, next) => {
    const promoCode = await createChaptersModel.findOne({
      chapter: { $regex: `^${req.query.code ?? ""}$`, $options: "i" },
    });
    // if (!promoCode) return next(new AppError("الكود غير موجود", 404));
    // if (!promoCode.active) return next(new AppError("الكود غير مفعل", 404));
    // if (promoCode.expiryDate < Date.now())
    //   return next(new AppError("انتهت صلاحية الكود", 404));
    // res.status(200).json({
    //   isError: false,
    //   message: "تم التحقق من الكود بنجاح",
    //   data: promoCode,
    // });
  };
exports.updateChapter = factory.updateOne(createChaptersModel);
exports.deleteChapter = factory.deleteOne(createChaptersModel);
