const mongoose = require("mongoose");

const createLectures = new mongoose.Schema(
  {
    lecture: {
      type: "string",
      required: [true, "Lecture Is Required"],
    },
    image: {
      type: "string",
    },
    video: {
      type: "string",
      required: [true, "Video File Is Required"],
    },
    quiz: {
      type: "string",
      required: [true, "Quiz File Is Required"],
    },
    pdf: {
      type: "string",
      required: [true, "Pdf File Is Required"],
    },

    section: {
      type: mongoose.Schema.ObjectId,
      ref: "Section",
    },
    ip:String
  },
  { timestamps: true }
);
createLectures.pre(/^find/, function (next) {
  this.populate({
    path: "section",
    select:"name"
  });
  next();
});
const createLecturesModel = mongoose.model("Lectures", createLectures);
module.exports = createLecturesModel;
