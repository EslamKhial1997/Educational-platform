const factory = require("./FactoryHandler");
const fs = require("fs");
const axios = require("axios");
const createLecturesModel = require("../Modules/createAlecture");
const expressAsyncHandler = require("express-async-handler");
const createSectionModel = require("../Modules/createSection");
const createTeachersModel = require("../Modules/createTeacher");

exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.pdf = req.file.filename;
  }

  next();
});
exports.createLectures = expressAsyncHandler(async (req, res) => {
  try {
    const section = await createSectionModel
      .findById(req.body.section)
      .then((e) => e.class.teacher._id);
    const teacherKey = await createTeachersModel
      .findById(section)
      .then((e) => e );
console.log(teacherKey);

    await axios
      .post(
        `https://video.bunnycdn.com/library/${teacherKey.libraryID}/videos`,
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
          key: teacherKey,
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
exports.updateLecture = factory.updateOne(createLecturesModel, "lecture");
exports.deleteLecture = factory.deleteOne(createLecturesModel, "lecture");
