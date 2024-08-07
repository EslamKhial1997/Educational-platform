const mongoose = require("mongoose");


const createTransaction = new mongoose.Schema(
  {
    ip:String,
    sender: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name: {
        type: String,
      },
      role: {
        type: String,
      },
    },

    receiver: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name: {
        type: String,
      },
      role: {
        type: String,
      },
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

// const transactionID = '66a773f72b547ef9eb962442'; // استبدل بهذا الـID الذي تبحث عنه

// // العثور على المعاملة والقيام بعملية populate
// createTransactionModel.findById(transactionID)
//   .populate({
//     path: 'sender',
//     select: 'name', // تحديد الحقول المطلوبة
//     model: function(doc) {
//       console.log(doc);

//       switch (doc.senderModel) {
//         case 'Users':
//           return createUsersModel;
//         case 'Teachers':
//           return createTeachersModel;
//         default:
//           return null;
//       }
//     }
//   })
//   .populate({
//     path: 'receiver',
//     select: 'name', // تحديد الحقول المطلوبة
//     model: function(doc) {
//       switch (doc.receiverModel) {
//         case 'Users':
//           return createUsersModel;
//         case 'Teachers':
//           return createTeachersModel;
//         default:
//           return null;
//       }
//     }
//   })

module.exports = createTransactionModel;
