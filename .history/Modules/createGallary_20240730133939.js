const mongoose = require("mongoose");

const createGall = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Gall Name Is Required"],
    },
    image: {
      type: String,
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "Teachers",
      
    },
  },
  { timestamps: true }
);
createGall.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select: "name",
  });
  next();
});
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/Gall`)) {
    const image = `${process.env.BASE_URL}/Gall/${doc.image}`;
    doc.image = image;
  }
};
createGall.post("init", (doc) => {
  ImageURL(doc);
});
createGall.post("save", (doc) => {
  ImageURL(doc);
});
const createGallModel = mongoose.model("Gall", createGall);
module.exports = createGallModel;
