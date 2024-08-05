const mongoose = require("mongoose");

const createSliderScema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "SliderScema Image Is Required"],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "Teachers",
      
    },
  },
  { timestamps: true }
);
createSliderScema.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select: "name",
  });
  next();
});
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/SliderScema`)) {
    const image = `${process.env.BASE_URL}/SliderScema/${doc.image}`;
    doc.image = image;
  }
};
createSliderScema.post("init", (doc) => {
  ImageURL(doc);
});
createSliderScema.post("save", (doc) => {
  ImageURL(doc);
});
const createSliderScemaModel = mongoose.model("SliderScemas", createSliderScema);
module.exports = createSliderScemaModel;
