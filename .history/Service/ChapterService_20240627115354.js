const factory = require("./FactoryHandler");

const createChaptersModel = require("../Modules/createChapter");

exports.createChapters = factory.createOne(createChaptersModel);
// exports.getChapters = factory.getAll(createChaptersModel);
exports.getChapters = async (req, res, next) => {
    const promoCode = await createChaptersModel.findOne({
      name: { $regex: `^${req.query.code ?? ""}$`, $options: "i" },
    });
    console.log(promoCode);
   
  };
exports.getChapter = factory.getOne(createChaptersModel);
exports.updateChapter = factory.updateOne(createChaptersModel);
exports.deleteChapter = factory.deleteOne(createChaptersModel);
