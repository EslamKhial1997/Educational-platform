const mongoose = require("mongoose");

const createSection = new mongoose.Schema(
  {
    class: {
      type: "string",
      required: [true, "Class Name Is Required"],
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
