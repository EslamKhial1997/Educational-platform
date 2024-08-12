const mongoose = require("mongoose");

const createLectures = new mongoose.Schema(
  {
    lecture: {
      type: "string",
      required: [true, "Lecture Is Required"],
    },
    price: {
      type: Number,
      default: 0,
      required: [true, "Lecture Price Is Required"],
    },
    image: {
      type: "string",
    },
    video: {
      type: "string",
      required: [true, "Video File Is Required"],
    },
    quiz: {
      type: "string",
      required: [true, "Quiz File Is Required"],
    },
    pdf: {
      type: String,
    
    },

    section: {
      type: mongoose.Schema.ObjectId,
      ref: "Section",
      required: [true, "section ID Is Required"],
    },
    ip: String,
  },
  { timestamps: true }
);
createLectures.pre(/^find/, function (next) {
  this.populate({
    path: "section",
    select: "name",
  })
 
  next();
});
const ImageURL = (doc) => {
 
  
  if (doc.pdf && !doc.pdf.includes(`${process.env.BASE_URL}/lecture`)) {
    const pdf = `${process.env.BASE_URL}/lecture/${doc.pdf}`;
    doc.pdf = pdf;
  }
};
createLectures.post("init", (doc) => {
  console.log(doc);
  ImageURL(doc);
});
createLectures.post("save", (doc) => {
  console.log(doc);
  ImageURL(doc);
});
const createLecturesModel = mongoose.model("Lectures", createLectures);
module.exports = createLecturesModel;
