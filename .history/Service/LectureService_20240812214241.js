
const factory = require("./FactoryHandler");

const createLecturesModel = require("../Modules/createAlecture");

exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
    if (req.file) {
        console.log(req.files);
        
    //   const imageType = req.files.image[0].mimetype.split("image/")[1];
  
    //   const filename = `image-${uuidv4()}-${Date.now()}.${
    //     imageType ? imageType : "jpeg"
    //   }`;
     
    //   req.body.image = filename;
    }


  
    next();
  });
exports.createLectures = factory.createOne(createLecturesModel);
exports.getLectures = factory.getAll(createLecturesModel);
exports.getLecture = factory.getOne(createLecturesModel);
exports.updateLecture = factory.updateOne(createLecturesModel);
exports.deleteLecture = factory.deleteOne(createLecturesModel);

