const mongoose = require("mongoose");

const createClass = new mongoose.Schema(
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
const createSectionModel = mongoose.model("Section", createClass);
module.exports = createSectionModel;
