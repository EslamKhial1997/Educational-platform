const mongoose = require("mongoose");

const createSection = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: []
    },
    expires: {
      type: String,
    },
  },
  { timestamps: true }
);

const createSectionModel = mongoose.model("Section", createSection);
module.exports = createSectionModel;
