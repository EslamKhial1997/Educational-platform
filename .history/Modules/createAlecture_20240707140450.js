const mongoose = require("mongoose");

const createChapters = new mongoose.Schema(
  {
    lecture: {
      type: "string",
      required: [true, "Chapter Name Is Required"],
    },
    secrion: {
      type: mongoose.Schema.ObjectId,
      ref: "Class",
    },
  },
  { timestamps: true }
);
createChapters.pre(/^find/, function (next) {
  this.populate({
    path: "class",
    select: "class",
  });
  next();
});
const createChaptersModel = mongoose.model("Chapters", createChapters);
module.exports = createChaptersModel;
