const mongoose = require("mongoose");

const createSlider = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "SliderSchema Image Is Required"],
    },
    teacher: {
      type: mongoose.Schema.ObjectId,
      ref: "Teachers",
      
    },
  },
  { timestamps: true }
);
createSliderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select: "name",
  });
  next();
});
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/SliderSchema`)) {
    const image = `${process.env.BASE_URL}/SliderSchema/${doc.image}`;
    doc.image = image;
  }
};
createSliderSchema.post("init", (doc) => {
  ImageURL(doc);
});
createSliderSchema.post("save", (doc) => {
  ImageURL(doc);
});
const createSliderSchemaModel = mongoose.model("SliderSchemas", createSliderSchema);
module.exports = createSliderSchemaModel;
