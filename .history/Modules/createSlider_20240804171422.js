const mongoose = require("mongoose");

const createSlider = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Slider Image Is Required"],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "Teachers",
      
    },
  },
  { timestamps: true }
);
createSlider.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select: "name",
  });
  next();
});
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/Slider`)) {
    const image = `${process.env.BASE_URL}/Slider/${doc.image}`;
    doc.image = image;
  }
};
createSlider.post("init", (doc) => {
  ImageURL(doc);
});
createSlider.post("save", (doc) => {
  ImageURL(doc);
});
const createSliderModel = mongoose.model("Sliders", createSlider);
module.exports = createSliderModel;
