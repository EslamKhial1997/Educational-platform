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
createClass.pre(/^find/, function (next) {
  this.populate({
    path: "chapter",
    select: "name",
  });
  next();
});
const createClassModel = mongoose.model("Class", createClass);
module.exports = createClassModel;
