
const factory = require("./FactoryHandler");

const createSectionModel = require("../Modules/createSection");

exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
    if (req.file) {
      const filename = `section-${uuidv4()}-${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/section/${filename}`);
      req.body.image = filename;
     
    }
    next();
  });
  
  
exports.uploadImage = UploadSingleImage("image");
exports.createSections = factory.createOne(createSectionModel);
exports.getSections = factory.getAll(createSectionModel);
exports.getSection = factory.getOne(createSectionModel);
exports.updateSection = factory.updateOne(createSectionModel);
exports.deleteSection = factory.deleteOne(createSectionModel);

