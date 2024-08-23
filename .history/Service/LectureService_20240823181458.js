const factory = require("./FactoryHandler");
const fs = require("fs");
const axios = require("axios");
const createLecturesModel = require("../Modules/createAlecture");
const expressAsyncHandler = require("express-async-handler");

exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  if (req.file) {
    req.body.pdf = req.file.filename;
  }

  next();
});
exports.createLectures = expressAsyncHandler(async (req, res) => {
  try {
    const form = new FormData();

    // إضافة ملف الفيديو إلى FormData
    form.append("video", req.file.buffer);

    // إرسال الفيديو إلى السيرفر الخارجي باستخدام Axios
    const response = await axios
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
        console.log(res);

        req.body.bunny = {
          videoLibraryId: response.data.videoLibraryId,
          guid: response.data.guid,
        };

        const createDoc = await createLecturesModel
          .create(req.body)
          .then(async (response) => {
            console.log(form.getHeaders());
            
            // const response = await axios.put(
            //   `https://video.bunnycdn.com/library/${response.bunny.videoLibraryId}/videos/${response.bunny.guid}`,
            //   form,
            //   {
            //     // headers: {
            //     //   ...form.getHeaders(),
            //     // },
            //     headers: {
            //       accept: "application/json",
            //       "content-type": "application/json",
            //       AccessKey: "d0b87ec7-1ee5-4df3-8fbdaa4ddb32-2958-4dd0",
            //     },
            //   }
            // );
          });
        res.status(201).json({ data: createDoc });
      });
    // const response = await axios.post("https://example.com/upload", form, {
    //   headers: {
    //     ...form.getHeaders(),
    //   },
    // });

    // طباعة الرد من السيرفر الخارجي
    // console.log("File uploaded successfully:", res.data);
    // res.send({ message: "File uploaded successfully!", data: res.data });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).send({ error: "Failed to upload video" });
  }
});

factory.createOne(createLecturesModel);
exports.getLectures = factory.getAll(createLecturesModel);
exports.getLecture = factory.getOne(createLecturesModel);
exports.updateLecture = factory.updateOne(createLecturesModel);
exports.deleteLecture = factory.deleteOne(createLecturesModel);
