const mongoose = require("mongoose");

const createSection = new mongoose.Schema(
  {
    name: {
      type:String,
      required: [true, "Section Name Is Required"],
    },
    price: {
      type: Number,
      required: [true, "Section Price Is Required"],
    },
    chapter: {
      type: mongoose.Schema.ObjectId,
      ref: "Chapters",
    },
  },
  { timestamps: true }
);
createSection.pre(/^find/, function (next) {
  this.populate({
    path: "chapter",
    select: "name",
  });
  next();
});
const createSectionModel = mongoose.model("Section", createSection);
module.exports = createSectionModel;
