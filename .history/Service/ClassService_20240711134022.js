
const factory = require("./FactoryHandler");
const createClassModel = require("../Modules/createClasses");



exports.resizeImage =()=>
 expressAsyncHandler(async (req, res, next) => {
    if (req.file) {
      const filename = `class-${uuidv4()}-${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/class/${filename}`);
      req.body.image = filename;
     
    }
    next();
  });
  
  
exports.uploadImage = UploadSingleImage("image");
exports.createClasses = factory.createOne(createClassModel);
exports.getClassess = factory.getAll(createClassModel);
exports.getClass = factory.getOne(createClassModel);


