const mongoose = require("mongoose");
const createUsersModel = require("./createUsers");
const createTeachersModel = require("./createTeacher");

const createTransaction = new mongoose.Schema(
  {
    sender: {
    
      name:String
    },
   senderModel: {
      type: String,
      required: true,
      enum: ["Users", "Teachers"], // النماذج الممكنة
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
   
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
