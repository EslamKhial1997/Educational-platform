const mongoose = require("mongoose");

const createTransaction = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Users", "Teachers"], // النماذج الممكنة
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "receiverModel",
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["Users", "Teachers"], // النماذج الممكنة
    },
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
