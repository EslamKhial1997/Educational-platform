const mongoose = require("mongoose");

const createSliderSc = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "SliderSc Image Is Required"],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "Teachers",
      
    },
  },
  { timestamps: true }
);
createSliderSc.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select: "name",
  });
  next();
});
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/SliderSc`)) {
    const image = `${process.env.BASE_URL}/SliderSc/${doc.image}`;
    doc.image = image;
  }
};
createSliderSc.post("init", (doc) => {
  ImageURL(doc);
});
createSliderSc.post("save", (doc) => {
  ImageURL(doc);
});
const createSliderScModel = mongoose.model("SliderScs", createSliderSc);
module.exports = createSliderScModel;
