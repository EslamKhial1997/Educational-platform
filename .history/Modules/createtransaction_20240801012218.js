const mongoose = require("mongoose");

const createTransaction = new mongoose.Schema(
  {
    sender: mongoose.Schema.Types.ObjectId,
    receiver: mongoose.Schema.Types.ObjectId,
    pointsSent: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
createSection.pre(/^find/, function (next) {
  this.populate({
    path: "chapter",
    select: "name",
  });
  next();
});
const createTransactionModel = mongoose.model(
  "Transactions",
  createTransaction
);
module.exports = createTransactionModel;
