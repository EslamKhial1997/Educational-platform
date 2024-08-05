const mongoose = require("mongoose");
const createUsersModel = require("./createUsers");
const createTeachersModel = require("./createTeacher");

const createTransaction = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['Users', 'Teachers'] // النماذج الممكنة
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "receiverModel",
    },
 
    pointsSent: Number,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const transactionID = 'your_transaction_id_here'; // استبدل هذا بالـID الذي تبحث عنه

// العثور على المعاملة والقيام بعملية populate
createTransaction.findById(transactionID)
  .populate({
    path: 'senderID',
    select: 'name', // تحديد الحقول المطلوبة
    model: function(doc) { return doc.senderModel; } // تحديد النموذج المناسب بناءً على قيمة senderModel
  })
  .populate({
    path: 'receiverID',
    select: 'name', // تحديد الحقول المطلوبة
    model: function(doc) { return doc.receiverModel; } // تحديد النموذج المناسب بناءً على قيمة receiverModel
  })
  .exec((err, transaction) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Transaction:', transaction);
    }
  });


// async function populateTransaction(transaction) {

  
//   const { sender ,senderModel } = transaction;
//  console.log(sender , senderModel);
 
//   let model;

//   switch (senderModel) {
//     case "Users":
//       model = createUsersModel;
//       break;
//     case "Teachers":
//       model = createTeachersModel;
//       break;
//     // أضف حالات أخرى مثل Admin و Manager
//     default:
//       throw new Error("Unknown sender model");
//   }


//   return model.findById(sender).select("name").exec();
// }

// const createTransactionModel = mongoose.model(
//   "Transactions",
//   createTransaction
// );
// createTransactionModel.find({})
//   .then(async (transactions) => {
//     for (let createTransactionModel of transactions) {
//       const sender = await populateTransaction(createTransactionModel);
//       // console.log('Sender Name:', sender ? sender.name : 'Not found');
//     }
//   })
//   .catch(err => console.error(err));
module.exports = createTransactionModel;
