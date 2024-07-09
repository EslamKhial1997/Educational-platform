const mongoose = require("mongoose");

const createChapters = new mongoose.Schema(
  {
    lecture: {
      type: "string",
      required: [true, "Chapter Name Is Required"],
    },
    lecture: {
      type: "string",
      required: [true, "Chapter Name Is Required"],
    },
    section: {
      type: mongoose.Schema.ObjectId,
      ref: "Section",
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
