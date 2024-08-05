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

const createTransactionModel = mongoose.model(
  "Transactions",
  createTransaction
);
module.exports = createTransactionModel;
createTransaction.find({})
  .populate('sender')
  .populate('receiver')
  .exec(function(err, transactions) {
    if (err) return handleError(err);
    console.log(transactions);
  });