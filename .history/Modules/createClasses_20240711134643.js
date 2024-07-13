const mongoose = require("mongoose");

const createClass = new mongoose.Schema(
  {
    class: {
      type: "string",
      required: [true, "Class Name Is Required"],
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
createClass.pre(/^find/, function (next) {
  this.populate({
    path: "teacher",
    select: "teachername",
  });
  next();
});
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/teacher`)) {
    const image = `${process.env.BASE_URL}/teacher/${doc.image}`;
    doc.image = image;
  }
};
createTeachers.post("init", (doc) => {
  ImageURL(doc);
});
createTeachers.post("save", (doc) => {
  ImageURL(doc);
});
const createClassModel = mongoose.model("Class", createClass);
module.exports = createClassModel;
