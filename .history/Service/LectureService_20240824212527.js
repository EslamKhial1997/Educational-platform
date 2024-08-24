const factory = require("./FactoryHandler");
const fs = require("fs");
const axios = require("axios");
const createLecturesModel = require("../Modules/createAlecture");
const expressAsyncHandler = require("express-async-handler");
const createSectionModel = require("../Modules/createSection");

exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.pdf = req.file.filename;
  }

  next();
});
exports.createLectures = expressAsyncHandler(async (req, res) => {
  try {
    const section = await createSectionModel.findById(req.body.section).then((e) => {log});
    console.log(section);
    
    await axios
      .post(
        "https://video.bunnycdn.com/library/289633/videos",
        { title: req.body.lecture },
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            AccessKey: "d0b87ec7-1ee5-4df3-8fbdaa4ddb32-2958-4dd0",
          },
        }
      )
      .then(async (response) => {
        req.body.bunny = {
          videoLibraryId: response.data.videoLibraryId,
          guid: response.data.guid,
        };

        const createDoc = await createLecturesModel.create(req.body);

        res.status(201).json({ data: createDoc });
      });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).send({ error: "Failed to upload video" });
  }
});

exports.getLectures = factory.getAll(createLecturesModel);
exports.getLecture = factory.getOne(createLecturesModel);
exports.updateLecture = factory.updateOne(createLecturesModel);
exports.deleteLecture = factory.deleteOne(createLecturesModel);
