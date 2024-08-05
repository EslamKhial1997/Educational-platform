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


createTransaction.pre('find', function(next) {
  this.populate({
    path: 'sender',
    select: 'name', // تحديد الحقول المطلوبة
    model: this.senderModel // تحديد النموذج المناسب بناءً على قيمة senderModel
  })
  .populate({
    path: 'receiver',
    select: 'name', // تحديد الحقول المطلوبة
    model: this.receiverModel // تحديد النموذج المناسب بناءً على قيمة receiverModel
  });
  next();
});

createTransaction.pre('findOne', function(next) {
  this.populate({
    path: 'senderID',
    select: 'name', // تحديد الحقول المطلوبة
    model: this.senderModel // تحديد النموذج المناسب بناءً على قيمة senderModel
  })
  .populate({
    path: 'receiverID',
    select: 'name', // تحديد الحقول المطلوبة
    model: this.receiverModel // تحديد النموذج المناسب بناءً على قيمة receiverModel
  });
  next();
});

const createTransactionModel = mongoose.model(
  "Transactions",
  createTransaction
);

module.exports = createTransactionModel;
