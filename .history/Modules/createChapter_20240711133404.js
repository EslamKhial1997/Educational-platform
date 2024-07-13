const mongoose = require("mongoose");

const createChapters = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Chapter Name Is Required"],
    },
    image: {
      type: String,
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
    select: "class",
  });
  next();
});
const createChaptersModel = mongoose.model("Chapters", createChapters);
module.exports = createChaptersModel;
