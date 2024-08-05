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

async function populateTransaction(transaction) {
  const { sender, senderModel } = transaction;
  let model;

  switch (senderModel) {
    case 'Users':
      model = User;
      break;
    case 'Teachers':
      model = Teacher;
      break;
    // أضف حالات أخرى مثل Admin و Manager
    default:
      throw new Error('Unknown sender model');
  }

  return model.findById(senderID).select('name').exec();
}

const createTransactionModel = mongoose.model(
  "Transactions",
  createTransaction
);

module.exports = createTransactionModel;
