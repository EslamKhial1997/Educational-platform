const mongoose = require("mongoose");

const createChapters = new mongoose.Schema(
  managerId: mongoose.Schema.Types.ObjectId,
  adminId: mongoose.Schema.Types.ObjectId,
  pointsSent: Number,
  date: { type: Date, default: Date.now }
  { timestamps: true }
);
createChapters.pre(/^find/, function (next) {
  this.populate({
    path: "class",
    select: "name",
  });
  next();
});
const ImageURL = (doc) => {
  if (doc.image && !doc.image.includes(`${process.env.BASE_URL}/chapter`)) {
    const image = `${process.env.BASE_URL}/chapter/${doc.image}`;
    doc.image = image;
  }
};
createChapters.post("init", (doc) => {
  ImageURL(doc);
});
createChapters.post("save", (doc) => {
  ImageURL(doc);
});
const createChaptersModel = mongoose.model("Chapters", createChapters);
module.exports = createChaptersModel;
