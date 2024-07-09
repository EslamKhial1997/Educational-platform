const mongoose = require("mongoose");

const createChapters = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Chapter Name Is Required"],
    },
    class: {
      type: mongoose.Schema.ObjectId,
      ref: "Class",
    },
  },
  { timestamps: true }
);
createChapters.pre(/^find/, function (next) {
  this.populate({
    path: "class",
    select: "name",
  }).po;
  next();
});
const createChaptersModel = mongoose.model("Chapters", createChapters);
module.exports = createChaptersModel;
