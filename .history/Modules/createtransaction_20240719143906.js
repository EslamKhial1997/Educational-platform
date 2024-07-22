const mongoose = require("mongoose");

const create  managerId: mongoose.Schema.Types.ObjectId,
adminId: mongoose.Schema.Types.ObjectId,
pointsSent: Number,
date: { type: Date, default: Date.now } = new mongoose.Schema(
  {
    managerId: mongoose.Schema.Types.ObjectId,
    adminId: mongoose.Schema.Types.ObjectId,
    pointsSent: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);



const createChaptersModel = mongoose.model("Chapters", createChapters);
module.exports = createChaptersModel;
