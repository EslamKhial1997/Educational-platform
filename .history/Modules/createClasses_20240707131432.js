const mongoose = require("mongoose");

const createClass = new mongoose.Schema(
  {
    class: {
      type: "string",
      required: [true, "Class Name Is Required"],
    },
    teacher:
  },
  { timestamps: true }
);

const createClassModel = mongoose.model("Class", createClass);
module.exports = createClassModel;
