
const factory = require("./FactoryHandler");

const createLecturesModel = require("../Modules/createAlecture");

exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
    if (req.files.pdf) {
      const imageType = req.files.image[0].mimetype.split("image/")[1];
  
      const filename = `image-${uuidv4()}-${Date.now()}.${
        imageType ? imageType : "jpeg"
      }`;
      await sharp(req.files.image[0].buffer)
        .resize(750, 750)
        .toFormat(imageType)
        .toFile(`uploads/teacher/${filename}`);
      req.body.image = filename;
    }

    if (req.files.avater) {
      const imageType = req.files.avater[0].mimetype.split("image/")[1];
  
      const filename = `avater-${uuidv4()}-${Date.now()}.${
        imageType ? imageType : "jpeg"
      }`;
      await sharp(req.files.avater[0].buffer)
        .resize(500, 750)
        .toFormat(imageType)
        .jpeg({ quality: 50 })
        .toFile(`uploads/teacher/${filename}`);
      req.body.avater = filename;
    }
  
    next();
  });
exports.createLectures = factory.createOne(createLecturesModel);
exports.getLectures = factory.getAll(createLecturesModel);
exports.getLecture = factory.getOne(createLecturesModel);
exports.updateLecture = factory.updateOne(createLecturesModel);
exports.deleteLecture = factory.deleteOne(createLecturesModel);

