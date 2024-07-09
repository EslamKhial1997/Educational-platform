const mongoose = require("mongoose");

const createLectures = new mongoose.Schema(
  {
    lecture: {
      type: "string",
      required: [true, "Lecture Is Required"],
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
  },
  { timestamps: true }
);
createLectures.pre(/^find/, function (next) {
  this.populate({
    path: "class",
    select: "class",
  });
  next();
});
const createLecturesModel = mongoose.model("Chapters", createLectures);
module.exports = createLecturesModel;
