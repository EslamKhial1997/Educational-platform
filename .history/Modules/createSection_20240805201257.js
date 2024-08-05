const mongoose = require("mongoose");

const createSection = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Section Name Is Required"],
    },
    description: {
      type: String,

    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Section Price Is Required"],
    },
    discount: {
      type: Number,
    },
    class: {
      type: mongoose.Schema.ObjectId,
      ref: "Class",
      required: [true, "Class ID Is Required"],
    },
  },
  { timestamps: true }
);
createSection.pre(/^find/, function (next) {
  this.populate({
    path: "class",
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
createSection.post("save", (doc) => {
  ImageURL(doc);
});
const createSectionModel = mongoose.model("Section", createSection);
module.exports = createSectionModel;
