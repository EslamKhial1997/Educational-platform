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
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/class`)) {
    const image = `${process.env.BASE_URL}/class/${doc.image}`;
    doc.image = image;
  }
};
createClass.post("init", (doc) => {
  ImageURL(doc);
});
createClass.post("save", (doc) => {
  ImageURL(doc);
});
const createChaptersModel = mongoose.model("Chapters", createChapters);
module.exports = createChaptersModel;
