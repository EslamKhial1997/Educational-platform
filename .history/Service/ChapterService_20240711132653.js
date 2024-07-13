const factory = require("./FactoryHandler");

const createChaptersModel = require("../Modules/createChapter");
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
    if (req.file) {
      const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/categories/${filename}`);
      req.body.image = filename;
     
    }
    next();
  });
  
  
  exports.uploadImage = UploadSingleImage("image");
exports.createChapters = factory.createOne(createChaptersModel);
exports.getChapters = factory.getAll(createChaptersModel);
exports.getChapter = factory.getOne(createChaptersModel);
exports.updateChapter = factory.updateOne(createChaptersModel);
exports.deleteChapter = factory.deleteOne(createChaptersModel);
