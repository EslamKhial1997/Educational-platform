const factory = require("./FactoryHandler");

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
    const videoPath = "./path-to-your-video/video.mp4"; // مسار الفيديو الذي تريد رفعه
    const form = new FormData();

    // قراءة ملف الفيديو كـ stream
    const videoStream = fs.createReadStream(videoPath);

    // إضافة ملف الفيديو إلى FormData
    form.append("video", videoStream, path.basename(videoPath));

    // إرسال الفيديو إلى السيرفر الخارجي باستخدام Axios
    const response = await axios
      .post(
        "https://video.bunnycdn.com/library/289633/videos",
        { title: "create video" },
        {
          headers: {
            accept: "application/json",
            "content-type": "application/json",
            AccessKey: "d0b87ec7-1ee5-4df3-8fbdaa4ddb32-2958-4dd0",
          },
        }
      )
      .then(async () => {
        req.body.video={
          video:{
            guid,
          }
        }
        const createDoc = await createLecturesModel.create(req.body);
        res.status(201).json({ data: createDoc });
        console.log(response.data);
      });
    // const response = await axios.post("https://example.com/upload", form, {
    //   headers: {
    //     ...form.getHeaders(),
    //   },
    // });

    // طباعة الرد من السيرفر الخارجي
    // console.log("File uploaded successfully:", response.data);
    // res.send({ message: "File uploaded successfully!", data: response.data });
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
