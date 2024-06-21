const mongoose = require("mongoose");

const createSection = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Section Name Is Required"],
    },
    chapter
  },
  { timestamps: true }
);

const createSectionModel = mongoose.model("Section", createSection);
module.exports = createSectionModel;
