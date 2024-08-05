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
createTransaction.find({})
  .populate('sender')
  .populate('receiverID')
  .exec(function(err, transactions) {
    if (err) return handleError(err);
    console.log(transactions);
  });
const createTransactionModel = mongoose.model(
  "Transactions",
  createTransaction
);
module.exports = createTransactionModel;
