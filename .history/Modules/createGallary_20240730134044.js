const mongoose = require("mongoose");

const createGallery = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: [true, "Gallery Name Is Required"],
    },
    image: {
      type: String,
      required: [true, "Gallery Image Is Required"],
    },
  },
  { timestamps: true }
);

const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/Gallery`)) {
    const image = `${process.env.BASE_URL}/Gallery/${doc.image}`;
    doc.image = image;
  }
};
createGallery.post("init", (doc) => {
  ImageURL(doc);
});
createGallery.post("save", (doc) => {
  ImageURL(doc);
});
const createGalleryModel = mongoose.model("Gallery", createGallery);
module.exports = createGalleryModel;
