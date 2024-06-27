const factory = require("./FactoryHandler");

const createChaptersModel = require("../Modules/createChapter");

exports.createChapters = factory.createOne(createChaptersModel);
// exports.getChapters = factory.getAll(createChaptersModel);
exports.getChapters = async (req, res, next) => {
    const promoCode = await createChaptersModel.findOne({
      code: { $regex: `^${req.query.code ?? ""}$`, $options: "i" },
    });
    
   
  };
exports.getChapter = factory.getOne(createChaptersModel);
exports.updateChapter = factory.updateOne(createChaptersModel);
exports.deleteChapter = factory.deleteOne(createChaptersModel);
