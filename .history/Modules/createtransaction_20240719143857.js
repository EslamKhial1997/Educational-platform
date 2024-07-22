const mongoose = require("mongoose");

const createChapters = new mongoose.Schema(
  {
    managerId: mongoose.Schema.Types.ObjectId,
    adminId: mongoose.Schema.Types.ObjectId,
    pointsSent: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


createChapters.post("init", (doc) => {
  ImageURL(doc);
});
createChapters.post("save", (doc) => {
  ImageURL(doc);
});
const createChaptersModel = mongoose.model("Chapters", createChapters);
module.exports = createChaptersModel;
