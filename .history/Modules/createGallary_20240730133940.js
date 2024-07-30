const mongoose = require("mongoose");

const createGalley = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Galley Name Is Required"],
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
createGalley.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select: "name",
  });
  next();
});
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/Galley`)) {
    const image = `${process.env.BASE_URL}/Galley/${doc.image}`;
    doc.image = image;
  }
};
createGalley.post("init", (doc) => {
  ImageURL(doc);
});
createGalley.post("save", (doc) => {
  ImageURL(doc);
});
const createGalleyModel = mongoose.model("Galley", createGalley);
module.exports = createGalleyModel;
