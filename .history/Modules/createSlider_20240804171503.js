const mongoose = require("mongoose");

const createSlider = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Slider Image Is Required"],
    },
  },
  { timestamps: true }
);

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
