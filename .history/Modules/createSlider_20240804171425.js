const mongoose = require("mongoose");

const createSliderSche = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "SliderSche Image Is Required"],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "Teachers",
      
    },
  },
  { timestamps: true }
);
createSliderSche.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select: "name",
  });
  next();
});
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/SliderSche`)) {
    const image = `${process.env.BASE_URL}/SliderSche/${doc.image}`;
    doc.image = image;
  }
};
createSliderSche.post("init", (doc) => {
  ImageURL(doc);
});
createSliderSche.post("save", (doc) => {
  ImageURL(doc);
});
const createSliderScheModel = mongoose.model("SliderSches", createSliderSche);
module.exports = createSliderScheModel;
