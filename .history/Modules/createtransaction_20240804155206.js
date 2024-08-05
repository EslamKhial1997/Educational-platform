const mongoose = require("mongoose");

const createTransaction = new mongoose.Schema(
  {
    sender: {
      type
    },
    receiver: mongoose.Schema.Types.ObjectId,
    pointsSent: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const createTransactionModel = mongoose.model(
  "Transactions",
  createTransaction
);
module.exports = createTransactionModel;
