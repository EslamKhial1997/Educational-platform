const mongoose = require("mongoose");

const createSliderScheam = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "SliderScheam Image Is Required"],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "Teachers",
      
    },
  },
  { timestamps: true }
);
createSliderScheam.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select: "name",
  });
  next();
});
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/SliderScheam`)) {
    const image = `${process.env.BASE_URL}/SliderScheam/${doc.image}`;
    doc.image = image;
  }
};
createSliderScheam.post("init", (doc) => {
  ImageURL(doc);
});
createSliderScheam.post("save", (doc) => {
  ImageURL(doc);
});
const createSliderScheamModel = mongoose.model("SliderScheams", createSliderScheam);
module.exports = createSliderScheamModel;
