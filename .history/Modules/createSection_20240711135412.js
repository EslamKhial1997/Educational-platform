const mongoose = require("mongoose");

const createSection = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Section Name Is Required"],
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Section Price Is Required"],
    },
    chapter: {
      type: mongoose.Schema.ObjectId,
      ref: "Chapters",
      required: [true, "Chapters ID Is Required"],
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
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/section`)) {
    const image = `${process.env.BASE_URL}/section/${doc.image}`;
    doc.image = image;
  }
};
createSection.post("init", (doc) => {
  ImageURL(doc);
});
createClass.post("save", (doc) => {
  ImageURL(doc);
});
const createSectionModel = mongoose.model("Section", createSection);
module.exports = createSectionModel;
