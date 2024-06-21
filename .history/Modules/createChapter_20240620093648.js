const mongoose = require("mongoose");

const createChapters = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Chapter Name Is Required"],
    },
  },
  { timestamps: true }
);

const createChaptersModel = mongoose.model("Chapters", createChapters);
module.exports = createChaptersModel;
