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
      enum: ["User", "Teacher"], // النماذج الممكنة
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "receiverModel",
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["User", "Teacher"], // النماذج الممكنة
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

const transactionID = 'your_transaction_id_here'; // استبدل بهذا الـID الذي تبحث عنه

// العثور على المعاملة والقيام بعملية populate
Transaction.findById(transactionID)
  .populate({
    path: 'senderID',
    select: 'name', // تحديد الحقول المطلوبة
    model: function(doc) {
      switch (doc.senderModel) {
        case 'User':
          return User;
        case 'Teacher':
          return Teacher;
        default:
          return null;
      }
    }
  })
  .populate({
    path: 'receiverID',
    select: 'name', // تحديد الحقول المطلوبة
    model: function(doc) {
      switch (doc.receiverModel) {
        case 'User':
          return User;
        case 'Teacher':
          return Teacher;
        default:
          return null;
      }
    }
  })
  .exec((err, transaction) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Transaction:', transaction);
    }
  });

module.exports = createTransactionModel;
