const expressAsyncHandler = require("express-async-handler");

exports.resizeImage = (type) =>
  expressAsyncHandler(async (req, res, next) => {
    if (req.file) {
      const filename = `${type}-${uuidv4()}-${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 70 })
        .toFile(`uploads/${type}/${filename}`);
      req.body.image = filename;
    }
    next();
  });

exports.uploadImage = UploadSingle("image");
